const express = require('express');

const { checkInvoice, payInvoice } = require('../controllers/pay');

const router = express.Router();

// @ GET /pay/:id
router.get('/:id/', checkInvoice);

// @ POST /pay/:id
router.post('/:id', payInvoice);

module.exports = router;
