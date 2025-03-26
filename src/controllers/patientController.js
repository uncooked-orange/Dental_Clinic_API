var supabase = require("../config/supabase");

const createPatient = async (req, res) => {
    try {
        const { name, age, gender, inner_oral_image, extra_oral_image, scan, total_cost, doctorId } = req.body;

        // Check if doctor exists and get patients array
        const { data: doctorData, error: doctorError } = await supabase.supabase
            .from("doctors")
            .select("id, name, patients")
            .eq("id", doctorId)
            .single();

        if (doctorError || !doctorData) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        // Create patient
        const { data: patientData, error: patientError } = await supabase.supabase
            .from("patients")
            .insert([{
                name: name,
                age: age,
                gender: gender,
                inner_oral_image: inner_oral_image,
                extra_oral_image: extra_oral_image,
                scan: scan,
                total_cost: total_cost,
                doctorid: doctorId
            }])
            .select()
            .single();

        if (patientError) {
            throw patientError;
        }

        // Update doctor's patients array
        const updatedPatients = [...(doctorData.patients || []), patientData.id];
        const { error: updateError } = await supabase.supabase
            .from("doctors")
            .update({ patients: updatedPatients })
            .eq("id", doctorId);

        if (updateError) {
            throw updateError;
        }

        res.status(201).json(patientData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPatientsByDoctor = async (req, res) => {
    try {
        const {doctor} = req.params;
        const {data, error} = await supabase.supabase
            .from("patients")
            .select("*")
            .eq("doctorId", doctor);
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}

const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, gender, inner_oral_image, extra_oral_image, scan, total_cost,total_paid, doctorId } = req.body;

        // Check if doctor exists and get patients array
        const { data: doctorData, error: doctorError } = await supabase.supabase
            .from("doctors")
            .select("id, name, patients")
            .eq("id", doctorId)
            .single();

        if (doctorError || !doctorData) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        // Update patient

        const { data: patientData, error: patientError } = await supabase.supabase
            .from("patients")
            .update({
                name: name,
                age: age,
                gender: gender,
                inner_oral_image: inner_oral_image,
                extra_oral_image: extra_oral_image,
                scan: scan,
                total_cost: total_cost,
                total_paid: total_paid,
                doctorId: doctorId
            })
            .eq("id", id)
            .select()
            .single();

        if (patientError) {
            throw patientError;
        }

        res.status(200).json(patientData);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}

const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if patient exists and get doctorId
        const { data: patientData, error: patientError } = await supabase.supabase
            .from("patients")
            .select("id, doctorId")
            .eq("id", id)
            .single();

        if (patientError || !patientData) {
            return res.status(404).json({ error: "Patient not found" });
        }

        // Check if doctor exists and get patients array
        const { data: doctorData, error: doctorError } = await supabase.supabase
            .from("doctors")
            .select("id, name, patients")
            .eq("id", patientData.doctorId)
            .single();

        if (doctorError || !doctorData) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        // Delete patient
        const { error: deleteError } = await supabase.supabase
            .from("patients")
            .delete()
            .eq("id", id);

        if (deleteError) {
            throw deleteError;
        }

        // Update doctor's patients array
        const updatedPatients = doctorData.patients.filter((patientId) => patientId !== id);
        const { error: updateError } = await supabase.supabase
            .from("doctors")
            .update({ patients: updatedPatients })
            .eq("id", patientData.doctorId);

        if (updateError) {
            throw updateError;
        }

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getPatientById = async (req, res) => {
    try {
        const {id} = req.params;
        const {data, error} = await supabase.supabase
            .from("patients")
            .select("*")
            .eq("id", id);
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
} 

const searchPatients = async (req, res) => {
    try {
        const {name} = req.params;
        const {data, error} = await supabase.supabase
            .from("patients")
            .select("name, id, doctorId")
            .ilike("name", `%${name}%`);
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}


module.exports = {createPatient, getPatientsByDoctor, searchPatients, getPatientById, updatePatient, deletePatient};