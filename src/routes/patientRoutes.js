const express = require('express');
const patientController = require('../controllers/patientController');

const router = express.Router();

router.get('/:id', patientController.getPatientById);
router.get('/search/:name', patientController.searchPatients);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

// Error handling

router.use((err, req, res, next) => {
    res.status(500).send({ error: err.message });
});

// Default route

router.all('*', (req, res) => {
    res.status(404).send({ message: 'Route not found' });
});

module.exports = router;