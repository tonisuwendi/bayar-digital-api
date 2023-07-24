const express = require('express');

const { ipaymu: webhookIpaymu } = require('../controllers/webhook');

const router = express.Router();

// @ POST /webhook/ipaymu
router.post('/ipaymu', webhookIpaymu);

module.exports = router;
