import express from 'express';

import { checkInvoice, payInvoice } from '../controllers/pay.js';

const router = express.Router();

// @ GET /pay/:id
router.get('/:id/', checkInvoice);

// @ POST /pay/:id
router.post('/:id', payInvoice);

export default router;
