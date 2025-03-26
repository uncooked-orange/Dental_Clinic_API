var supabase = require("../config/supabase");

const getDoctorsByClinic = async (req, res) => {
    try {
        const { clinic } = req.params;
        const { data, error } = await supabase.supabase
            .from("doctors")
            .select("*")
            .eq("clinic", clinic);
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const searchDoctors = async (req, res) => {
    try {
        const { name } = req.params;
        const { data, error } = await supabase.supabase
            .from("doctors")
            .select("name,id,clinic")
            .ilike("name", `%${name}%`);
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllDoctors = async (req, res) => {
    try {
        const { data, error } = await supabase.supabase
            .from("doctors")
            .select("*");
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getPatientsByDoctor = async (req, res) => {
    try {
        const { doctor } = req.params;
        const { data, error } = await supabase.supabase
            .from("patients")
            .select("*")
            .eq("doctorId", doctor);
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createDoctor = async (req, res) => {
    try {
        const { name, clinic, email, password } = req.body;

        // First check if email already exists
        const { data: existingUser, error: emailCheckError } = await supabase.supabase
            .from("doctors")
            .select("email")
            .eq("email", email)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Create auth user first
        const { data: authData, error: authError } = await supabase.supabase.auth
            .signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                        role: 'doctor'
                    }
                }
            });

        if (authError) {
            throw new Error(`Authentication error: ${authError.message}`);
        }

        if (!authData.user) {
            throw new Error('Failed to create authentication record');
        }

        // Check if the clinic exists
        const { data: clinicData, error: clinicError } = await supabase.supabase
            .from("clinics")
            .select("name, doctors")
            .eq("name", clinic)
            .single();

        let clinicName;
        let updatedDoctors = [];

        if (clinicData) {
            clinicName = clinicData.name;
            updatedDoctors = clinicData.doctors || [];
        } else {
            const { data: newClinicData, error: newClinicError } = await supabase.supabase
                .from("clinics")
                .insert([{ name: clinic, doctors: [] }])
                .select()
                .single();

            if (newClinicError) {
                // Cleanup: Delete the auth user if clinic creation fails
                await supabase.supabase.auth.admin.deleteUser(authData.user.id);
                throw newClinicError;
            }

            clinicName = newClinicData.name;
        }

        // Insert the new doctor with auth user ID
        const { data: doctorData, error: doctorError } = await supabase.supabase
            .from("doctors")
            .insert([{
                id: authData.user.id, // Use the auth user ID as the doctor's ID
                name: name,
                clinic: clinicName,
                patients: []
            }])
            .select()
            .single();

        if (doctorError) {
            // Cleanup: Delete the auth user if doctor creation fails
            await supabase.supabase.auth.admin.deleteUser(authData.user.id);
            throw doctorError;
        }

        // Update clinic with new doctor
        const { error: updateError } = await supabase.supabase
            .from("clinics")
            .update({ doctors: [...updatedDoctors, doctorData.id] })
            .eq("name", clinicName);

        if (updateError) {
            // Cleanup: Delete both auth user and doctor if clinic update fails
            await supabase.supabase.auth.admin.deleteUser(authData.user.id);
            await supabase.supabase.from("doctors").delete().eq("id", doctorData.id);
            throw updateError;
        }

        // Return success without sending sensitive info
        res.status(201).json({
            id: doctorData.id,
            name: doctorData.name,
            email: doctorData.email,
            clinic: doctorData.clinic,
            message: "Doctor created successfully. Please verify your email."
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        // Get doctor data (including auth_id and clinic name)
        const { data: doctorData, error: doctorError } = await supabase.supabase
            .from("doctors")
            .select("id, clinic")
            .eq("id", id)
            .single();

        if (doctorError || !doctorData) {
            return res.status(404).json({ error: doctorError });
        }

        // Fetch the clinic data to get the current list of doctors
        const { data: clinicData, error: clinicError } = await supabase.supabase
            .from("clinics")
            .select("doctors")
            .eq("name", doctorData.clinic)  // clinic is the name, not an array
            .single();

        if (clinicError || !clinicData) {
            return res.status(404).json({ error: "Clinic not found" });
        }

        // Ensure doctors field is an array before filtering
        const updatedDoctors = Array.isArray(clinicData.doctors)
            ? clinicData.doctors.filter((doctorId) => doctorId !== id)
            : [];

        // Update clinic's doctors array
        const { error: updateError } = await supabase.supabase
            .from("clinics")
            .update({ doctors: updatedDoctors })
            .eq("name", doctorData.clinic);

        if (updateError) {
            throw updateError;
        }

        // Delete doctor from the database
        const { error: deleteError } = await supabase.supabase
            .from("doctors")
            .delete()
            .eq("id", id);

        if (deleteError) {
            throw deleteError;
        }

        // Delete auth user using the correct auth ID
        const { error: authError } = await supabase.supabase.auth.admin.deleteUser(doctorData.id);

        if (authError) {
            throw authError;
        }

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getDoctorsByClinic, getPatientsByDoctor, createDoctor, searchDoctors, deleteDoctor, getAllDoctors };