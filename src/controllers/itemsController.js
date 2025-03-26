var supabase = require('../config/supabase');

const createItem = async (req, res) => {
    try {
        const { name, rate, description} = req.body;
        const { data, error } = await supabase.supabase
            .from("items")
            .insert([{ name: name, rate: rate, description: description }])
            .select("*");
        if (error) {
            throw error;
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getItems = async (req, res) => {
    try {
        const { data, error } = await supabase.supabase
            .from("items")
            .select("*");
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.supabase
            .from("items")
            .select("*")
            .eq("id", id);
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const searchItems = async (req, res) => {
    try {
        const { name } = req.params;
        const { data, error } = await supabase.supabase
            .from("items")
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

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, rate, discount, description } = req.body;
        const { data, error } = await supabase.supabase
            .from("items")
            .update({ name: name, rate: rate, discount: discount, description: description })
            .eq("id", id);
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.supabase
            .from("items")
            .delete()
            .eq("id", id);
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createItem,
    getItems,
    getItemById,
    searchItems,
    updateItem,
    deleteItem
};