import express from 'express';

import { getInvoice } from '../controllers/invoice.js';

const router = express.Router();

// @ GET /invoice/:id
router.get('/:id', getInvoice);

export default router;
