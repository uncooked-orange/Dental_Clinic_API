const express = require('express');
const itemsController = require('../controllers/itemsController');

const router = express.Router();

router.get('/:id', itemsController.getItemById);
router.get('/search/:name', itemsController.searchItems);
router.get('/', itemsController.getItems);
router.post('/', itemsController.createItem);
router.put('/:id', itemsController.updateItem);
router.delete('/:id', itemsController.deleteItem);

// Error handling

router.use((err, req, res, next) => {
    res.status(500).send({ error: err.message });
});

// Default route

router.all('*', (req, res) => {
    res.status(404).send({ message: 'Route not found' });
});

module.exports = router;