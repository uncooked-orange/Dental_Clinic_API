const express = require('express');
const doctorController = require('../controllers/doctorController');

const router = express.Router();

router.get('/clinic/:clinic', doctorController.getDoctorsByClinic);
router.get('/', doctorController.getAllDoctors);
router.get('/:doctor', doctorController.getPatientsByDoctor);
router.get('/search/:name', doctorController.searchDoctors);
router.post('/', doctorController.createDoctor);
router.delete('/:id', doctorController.deleteDoctor);
// Error handling

router.use((err, req, res, next) => {
    res.status(500).send({ error: err.message });
});

// Default route

router.all('*', (req, res) => {
    res.status(404).send({ message: 'Route not found' });
});

module.exports = router;