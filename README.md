# Dental Clinic API

A RESTful API built with Node.js and Express for managing a dental clinic. The API is connected to a Supabase PostgreSQL database and provides endpoints for handling treatments, cases, patients, dentists, and other clinic-related data.

## Features

- **User Authentication** (JWT-based authentication for secure access)
- **Patients Management** (CRUD operations for patient records)
- **Dentists & Staff Management** (Manage dentist profiles and schedules)
- **Billing & Payments** (Handle invoices and payments)
- **Supabase Integration** (PostgreSQL database for storing clinic data)

## Technologies Used

- **Node.js** (Runtime environment)
- **Express.js** (Web framework for handling routes and controllers)
- **Supabase** (PostgreSQL database backend)
- **JWT Authentication** (User authentication and security)
- **dotenv** (Environment variable management)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/uncooked-orange/Dental_Clinic_API.git
   cd Dental-Clinic-API
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT = 5000
   SUPABASE_URL = your supabase URL
   SUPABASE_KEY = your supabase key
   ```bash
   npm start
   ```

## API Endpoints

### All Routes Begin with /api/v1

### Authentication
| Method | Endpoint       | Description            |
|--------|--------------|------------------------|
| POST   | `/login ` | User login  (returns User ID and JWT Info)      |
| POST   | `/logout` | User logout      |
| GET   | `/session ` | Check Session and Refresh             |
| POST   | `/registerAdmin` | Add a new Admin (temporary route)      |

### Patients
| Method | Endpoint         | Description                 |
|--------|----------------|-----------------------------|
| GET    | `/patient/search/:name`     | Get all patients by name           |
| GET    | `/patient/:id` | Get a single patient by ID  |
| POST   | `/patient`     | Add a new patient           |
| PUT    | `/patient/:id` | Update a patient record     |
| DELETE | `/patient/:id` | Delete a patient record     |

### Invoices
| Method | Endpoint           | Description                  |
|--------|------------------|------------------------------|
| GET    | `/invoice`   | Get all invoice (unsafe)       |
| GET    | `/invoice/:id` | Get an invoice by ID |
| GET    | `/invoice/clinic/:clinic`   | Get all invoices By clinicID      |
| GET    | `/invoice/doctor/:doctor` | Get all invoices By doctorID |
| GET    | `/invoice/patient/:patient` | Get all invoices By patientID |
| POST   | `/invoice`   | Create a new invoice   |
| PUT    | `/invoice/:id` | Update an invoice     |
| DELETE | `/invoice/:id` | Cancel an invoice    |

### Doctors
| Method | Endpoint       | Description               |
|--------|--------------|---------------------------|
| GET    | `/doctor`   | Get all doctors        |
| GET    | `/doctor/:id` | Get a doctor by ID      |
| GET    | `/doctor/clinic/:clinic` | Get all doctors by clinicID      |
| GET    | `/doctor/search/:name` | Get all doctors by name      |
| POST   | `/doctor`   | Add a new dentist        |
| DELETE | `/doctor/:id` | Remove a dentist        |

### Clinics
| Method | Endpoint         | Description                 |
|--------|----------------|-----------------------------|
| GET    | `/clinic`     | Get all clinics           |
| GET    | `/clinic/search/:name`     | Get all clinics by name           |
| GET    | `/clinic/:id` | Get a single clinic by ID  |
| POST   | `/clinic`     | Add a new clinic           |
| PUT    | `/clinic/:id` | Update a clinic record     |
| DELETE | `/clinic/:id` | Delete a clinic record     |

### Items
| Method | Endpoint       | Description               |
|--------|--------------|---------------------------|
| GET    | `/item`   | Get all items        |
| GET    | `/item/:id` | Get an item by ID      |
| GET    | `/item/search/:name` | Get all items by name      |
| POST   | `/item`   | Add a new item        |
| PUT    | `/item/:id` | Update an item     |
| DELETE | `/item/:id` | Remove an item        |

## DATABASE Initialization


In you Supabase Project. go to the SQL editor and Execute the code in the DBInitialize file to fully initialize the database.


## Contact

For any inquiries, feel free to reach out:
- **Email:** hasanfalah2003@gmail.com
- **GitHub:** [uncooked-orange](https://github.com/uncooked-orange)

### TO-DO

- add access restrictions to the routes by checking the JWT tokens
- add the update info for the doctor route

