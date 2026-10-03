const express = require('express');
const controller = require('../controllers/moradorController');

const router = express.Router();

router.get('/', controller.list);
router.get('/:id', controller.findById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;