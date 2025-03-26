const express = require('express');
const clinicController = require('../controllers/clinicController');

const router = express.Router();

router.get('/', clinicController.getAllClinics);
router.get('/:name', clinicController.getClinic);
router.get('/search/:name', clinicController.searchClinic);
router.post('/', clinicController.createClinic);
router.delete('/:name', clinicController.deleteClinic);

// Error handling

router.use((err, req, res, next) => {
    res.status(500).send({ error: err.message });
});

// Default route

router.all('*', (req, res) => {
    res.status(404).send({ message: 'Route not found' });
});

module.exports = router;