const express = require('express');

const { getInvoice } = require('../controllers/invoice');

const router = express.Router();

// @ GET /invoice/:id
router.get('/:id', getInvoice);

module.exports = router;
