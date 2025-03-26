const express = require('express');
const cors = require('cors');
const logger = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes
app.use('api/v1/clinic', require('./routes/clinicRoutes'));
app.use('api/v1/doctor', require('./routes/doctorRoutes'));
app.use('api/v1/patient', require('./routes/patientRoutes'));
app.use('api/v1/item', require('./routes/itemsRoutes'));
app.use('api/v1/invoice', require('./routes/invoiceRoutes'));
app.use('api/v1', require('./routes/loginRoutes'));
app

app.get('api/v1', (req, res) => {
    //return basic message

    res.send('Hello World');
});

module.exports = {app};