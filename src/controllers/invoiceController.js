var supabase = require('../config/supabase.js');

const createInvoice = async (req, res) => {
    // Create a new invoice as follows: {clinic : text, doctor : uuid, patient : uuid, items : jsonb ({itemId : uuid, quantity : integer, newRate : integer}), subtotal : numeric, discount : float, isPaid : boolean}
        try {
        const { clinic, doctor, patient, items, subtotal, discount = 0, isPaid = false} = req.body;
        
        // Check structure of items
        if (!Array.isArray(items)) {
            throw new Error("Items must be an array");
        }

        // Check if items are valid and if newRate is not specified set it to -1
        for (let i = 0; i < items.length; i++) {
            if (!items[i].itemId || !items[i].quantity) {
                throw new Error("Item must have itemId and quantity");
            }
            if (!items[i].newRate) {
                items[i].newRate = -1;
            }
        }
        // Create invoice
        const { data: invoiceData, error: invoiceError } = await supabase.supabase
            .from("invoices")
            .insert([{ clinic:clinic, doctorid:doctor, patientid:patient, items:items, sub_total:subtotal, discount:discount , isPaid:isPaid }])
            .select()
            .single();

        if (invoiceError) {
            throw invoiceError;
        }

        res.status(201).json(invoiceData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllInvoices = async (req, res) => {
    try {
        const { data : invoices, error } = await supabase.supabase
            .from("invoices")
            .select("*");
        if (error) {
            throw error;
        }
        // Get all unique item IDs from all invoices
        const allItemIds = new Set();
        invoices.forEach(invoice => {
            invoice.items.forEach(item => {
                allItemIds.add(item.itemId);
            });
        });

        // Fetch item details including name and description
        const { data: itemsData, error: itemsError } = await supabase.supabase
            .from("items")
            .select("id, rate, name, description")  // Added name and description
            .in("id", Array.from(allItemIds));

        if (itemsError) {
            throw itemsError;
        }

        // Create a map of item details for quick lookup
        const itemDetails = new Map(
            itemsData.map(item => [item.id, {
                rate: item.rate,
                name: item.name,
                description: item.description
            }])
        );

        // Enhance invoice items with full item details
        const enhancedInvoices = invoices.map(invoice => ({
            ...invoice,
            items: invoice.items.map(item => ({
                ...item,
                ...itemDetails.get(item.itemId)  // Spread operator to add all item details
            }))
        }));

        res.status(200).json(enhancedInvoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getInvoicesByPatient = async (req, res) => {
    try {
        const { patient } = req.params;
        const { data : invoices, error } = await supabase.supabase
            .from("invoices")
            .select("*")
            .eq("patientid", patient);
        if (error) {
            throw error;
        }
        // Get all unique item IDs from all invoices
        const allItemIds = new Set();
        invoices.forEach(invoice => {
            invoice.items.forEach(item => {
                allItemIds.add(item.itemId);
            });
        });

        // Fetch item details including name and description
        const { data: itemsData, error: itemsError } = await supabase.supabase
            .from("items")
            .select("id, rate, name, description")  // Added name and description
            .in("id", Array.from(allItemIds));

        if (itemsError) {
            throw itemsError;
        }

        // Create a map of item details for quick lookup
        const itemDetails = new Map(
            itemsData.map(item => [item.id, {
                rate: item.rate,
                name: item.name,
                description: item.description
            }])
        );

        // Enhance invoice items with full item details
        const enhancedInvoices = invoices.map(invoice => ({
            ...invoice,
            items: invoice.items.map(item => ({
                ...item,
                ...itemDetails.get(item.itemId)  // Spread operator to add all item details
            }))
        }));

        res.status(200).json(enhancedInvoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}   

const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data : invoices, error } = await supabase.supabase
            .from("invoices")
            .select("*")
            .eq("id", id);
        if (error) {
            throw error;
        }
        // Get all unique item IDs from all invoices
        const allItemIds = new Set();
        invoices.forEach(invoice => {
            invoice.items.forEach(item => {
                allItemIds.add(item.itemId);
            });
        });

        // Fetch item details including name and description
        const { data: itemsData, error: itemsError } = await supabase.supabase
            .from("items")
            .select("id, rate, name, description")  // Added name and description
            .in("id", Array.from(allItemIds));

        if (itemsError) {
            throw itemsError;
        }

        // Create a map of item details for quick lookup
        const itemDetails = new Map(
            itemsData.map(item => [item.id, {
                rate: item.rate,
                name: item.name,
                description: item.description
            }])
        );

        // Enhance invoice items with full item details
        const enhancedInvoices = invoices.map(invoice => ({
            ...invoice,
            items: invoice.items.map(item => ({
                ...item,
                ...itemDetails.get(item.itemId)  // Spread operator to add all item details
            }))
        }));

        res.status(200).json(enhancedInvoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getInvoicesByDoctor = async (req, res) => {
    try {
        const { doctor } = req.params;
        const { data : invoices, error } = await supabase.supabase
            .from("invoices")
            .select("*")
            .eq("doctorid", doctor);
        if (error) {
            throw error;
        }
       // Get all unique item IDs from all invoices
       const allItemIds = new Set();
       invoices.forEach(invoice => {
           invoice.items.forEach(item => {
               allItemIds.add(item.itemId);
           });
       });

       // Fetch item details including name and description
       const { data: itemsData, error: itemsError } = await supabase.supabase
       .from("items")
       .select("id, rate, name, description")  // Added name and description
       .in("id", Array.from(allItemIds));

    if (itemsError) {
        throw itemsError;
    }

    // Create a map of item details for quick lookup
    const itemDetails = new Map(
        itemsData.map(item => [item.id, {
            rate: item.rate,
            name: item.name,
            description: item.description
        }])
    );

    // Enhance invoice items with full item details
    const enhancedInvoices = invoices.map(invoice => ({
        ...invoice,
        items: invoice.items.map(item => ({
            ...item,
            ...itemDetails.get(item.itemId)  // Spread operator to add all item details
        }))
    }));

       res.status(200).json(enhancedInvoices);
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
}

const getInvoicesByClinic = async (req, res) => {
    try {
        const { clinic } = req.params;
        
        // Get invoices for the clinic
        const { data: invoices, error: invoiceError } = await supabase.supabase
            .from("invoices")
            .select("*")
            .eq("clinic", clinic);

        if (invoiceError) {
            throw invoiceError;
        }

        // Get all unique item IDs from all invoices
        const allItemIds = new Set();
        invoices.forEach(invoice => {
            invoice.items.forEach(item => {
                allItemIds.add(item.itemId);
            });
        });

        // Fetch item details including name and description
        const { data: itemsData, error: itemsError } = await supabase.supabase
            .from("items")
            .select("id, rate, name, description")  // Added name and description
            .in("id", Array.from(allItemIds));

        if (itemsError) {
            throw itemsError;
        }

        // Create a map of item details for quick lookup
        const itemDetails = new Map(
            itemsData.map(item => [item.id, {
                rate: item.rate,
                name: item.name,
                description: item.description
            }])
        );

        // Enhance invoice items with full item details
        const enhancedInvoices = invoices.map(invoice => ({
            ...invoice,
            items: invoice.items.map(item => ({
                ...item,
                ...itemDetails.get(item.itemId)  // Spread operator to add all item details
            }))
        }));

        res.status(200).json(enhancedInvoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.supabase
            .from("invoices")
            .delete()
            .eq("id", id);
        if (error) {
            throw error;
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { clinic, doctor, patient, items, subtotal, discount = 0, isPaid = false } = req.body;

        // Update invoice
        const { data: invoiceData, error: invoiceError } = await supabase.supabase
            .from("invoices")
            .update({ clinic: clinic, doctorid: doctor, patientid: patient, items: items, sub_total: subtotal, discount: discount, isPaid: isPaid })
            .eq("id", id)
            .select()
            .single();

        if (invoiceError) {
            throw invoiceError;
        }

        res.status(200).json(invoiceData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports ={
    createInvoice,
    getInvoicesByPatient,
    getAllInvoices,
    getInvoiceById,
    getInvoicesByDoctor,
    getInvoicesByClinic,
    deleteInvoice,
    updateInvoice
};