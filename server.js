/* eslint-disable no-console */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import invoiceRoutes from './src/routes/invoice.js';
import payInvoice from './src/routes/pay.js';

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
process.env.TZ = 'Asia/Jakarta';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
    res.status(200).json({
        success: true,
        msg: 'Selamat datang di API bayar-digital.',
    });
});

app.use('/invoice', invoiceRoutes);
app.use('/pay', payInvoice);

app.listen(PORT, (error) => {
    if (error) console.log(error);
    console.log(`Server is running on PORT ${PORT}`);
});
