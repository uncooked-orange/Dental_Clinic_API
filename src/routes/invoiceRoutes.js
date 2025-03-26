const express = require('express');
const invoiceController = require('../controllers/invoiceController');

const router = express.Router();


router.get('/:id', invoiceController.getInvoiceById);
router.get('/', invoiceController.getAllInvoices);
router.get('/doctor/:doctor', invoiceController.getInvoicesByDoctor);
router.get('/patient/:patient', invoiceController.getInvoicesByPatient);
router.get('/clinic/:clinic', invoiceController.getInvoicesByClinic);
router.post('/', invoiceController.createInvoice);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

// Error handling

router.use((err, req, res, next) => {
    res.status(500).send({ error: err.message });
});

// Default route

router.all('*', (req, res) => {
    res.status(404).send({ message: 'Route not found' });
});

module.exports = router;