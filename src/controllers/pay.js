import invoices from '../data/invoice.js';
import { iPaymuAPI } from '../helpers/service.js';
import { handleValidatePayInvoice } from '../helpers/utils.js';

export const payInvoice = async (req, res) => {
    const {
        name,
        phone,
        email,
        payment_method: paymentMethod,
        payment_channel: paymentChannel,
    } = req.body;
    const { id } = req.params;

    const selectedInvoice = invoices.find((invoice) => invoice.id === id);
    if (!selectedInvoice) {
        res.status(404).json({
            success: false,
            message: 'Invoice tidak ditemukan.',
        });
        return;
    }

    const validation = handleValidatePayInvoice({
        name, phone, email, paymentMethod, paymentChannel,
    });

    if (!validation.success) {
        res.status(400).json(validation);
        return;
    }

    try {
        const payload = {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            amount: selectedInvoice.price,
            notifyUrl: selectedInvoice.ipaymu_notify_url,
            expired: 1,
            expiredType: 'days',
            referenceId: selectedInvoice.invoice_code,
            paymentMethod,
            paymentChannel,
            product: [selectedInvoice.title],
            qty: [1],
            price: [selectedInvoice.price],
        };
        const response = await iPaymuAPI({
            endpoint: 'payment/direct',
            method: 'POST',
            body: payload,
        });
        if (!response.Success) throw new Error(JSON.stringify(response));
        const { ReferenceId, TransactionId } = response.Data;
        res.status(200).json({
            success: true,
            message: 'Berhasil membuat pembayaran!',
            data: {
                invoice: ReferenceId,
                transaction_id: TransactionId,
            },
        });
    } catch (error) {
        const errorData = JSON.parse(error.message);
        res.status(errorData.Status || 500).json(errorData);
    }
};

export const checkInvoice = async (req, res) => {
    const { id, transaction_id: transactionId } = req.params;

    if (!transactionId || transactionId.trim() === '') {
        res.status(400).json({
            success: false,
            message: 'Transaksi ID harus diisi.',
        });
        return;
    }

    const selectedInvoice = invoices.find((invoice) => invoice.id === id);
    if (!selectedInvoice) {
        res.status(404).json({
            success: false,
            message: 'Invoice tidak ditemukan.',
        });
        return;
    }

    try {
        const payload = {
            transactionId,
            account: process.env.IPAYMU_VIRTUAL_ACCOUNT,
        };
        const response = await iPaymuAPI({
            endpoint: 'transaction',
            method: 'POST',
            body: payload,
        });
        if (!response.Success) throw new Error(JSON.stringify(response));
        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data pembayaran!',
            data: response.Data,
        });
    } catch (error) {
        const errorData = JSON.parse(error.message);
        res.status(errorData.Status || 500).json(errorData);
    }
};
