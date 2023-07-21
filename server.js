/* eslint-disable no-console */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const invoiceRoutes = require('./src/routes/invoice');
const payInvoice = require('./src/routes/pay');

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
