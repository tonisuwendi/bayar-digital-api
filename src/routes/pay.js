import express from 'express';

import { checkInvoice, payInvoice } from '../controllers/pay.js';

const router = express.Router();

// @ GET /pay/:id/:transaction_id
router.get('/:id/:transaction_id', checkInvoice);

// @ POST /pay/:id
router.post('/:id', payInvoice);

export default router;
