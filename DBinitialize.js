// initialize the database tables from supabase

/*
CREATE TABLE clinics (
    name TEXT PRIMARY KEY NOT NULL,
    doctors UUID[] -- Array of Doctor IDs
);

CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    clinic TEXT NOT NULL REFERENCES clinics(name) ON DELETE CASCADE,
    patients UUID[] -- Array of Patient IDs
);

CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    age INT NOT NULL,
    gender BOOLEAN NOT NULL, -- False = Female, True = Male
    inner_oral_image TEXT, -- Store file URL
    extra_oral_image TEXT,
    scan TEXT, -- Store file URL,
    total_cost NUMERIC, -- Total cost of treatment,
    total_paid NUMERIC default 0, -- Total amount paid by patient,
    doctorId UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE
);

CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    rate NUMERIC NOT NULL,
    description TEXT
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY, -- Auto-incrementing numeric ID
    date TIMESTAMP DEFAULT NOW(), -- Stores invoice creation time
    clinic TEXT NOT NULL,
    doctorID UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    patientID UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    sub_total NUMERIC NOT NULL, -- Before discount
    discount INT DEFAULT 0, -- Discount as a percentage (e.g., 10 for 10%)
    total NUMERIC GENERATED ALWAYS AS (sub_total - (sub_total * discount / 100)) STORED, -- Auto-calculated total
    isPaid BOOLEAN DEFAULT FALSE, -- True if invoice is paid
    items JSONB NOT NULL -- Stores array of item IDs with quantities
);

CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);
*/
