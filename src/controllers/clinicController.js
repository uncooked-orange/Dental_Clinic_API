var supabase = require("../config/supabase");

const getAllClinics = async (req, res) => {
    try {
        const { data, error } = await supabase.supabase
            .from("clinics")
            .select("*");
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getClinic = async (req, res) => {
    try {
        const { name } = req.params;
        const { data, error } = await supabase.supabase
            .from("clinics")
            .select("*")
            .eq("name", name);
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const searchClinic = async (req, res) => {
    try {
        const { name } = req.params;
        const { data, error } = await supabase.supabase
            .from("clinics")
            .select("*")
            .ilike("name", `%${name}%`);
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createClinic = async (req, res) => {
    try {
        const { name } = req.body;
        const { data, error } = await supabase.supabase
            .from("clinics")
            .insert([{ name }]);
        if (error) {
            throw error;
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteClinic = async (req, res) => {
    try {
        const { name } = req.params;
        const { data, error } = await supabase.supabase
            .from("clinics")
            .delete()
            .eq("name", name);
        if (error) {
            throw error;
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = { getAllClinics, getClinic, searchClinic, createClinic, deleteClinic };