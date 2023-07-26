const pool = require('../config/database');
const { iPaymuAPI } = require('../helpers/service');
const { ValidationError, generateRandomString, handleValidatePayInvoice } = require('../helpers/utils');

exports.payInvoice = async (req, res) => {
    const {
        name,
        phone,
        email,
        payment_method: paymentMethod,
        payment_channel: paymentChannel,
    } = req.body;
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM invoice WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error_code: 'CPPI1',
                message: 'Invoice tidak ditemukan.',
            });
        }

        const validation = handleValidatePayInvoice({
            name, phone, email, paymentMethod, paymentChannel,
        });

        if (!validation.success) {
            return res.status(400).json({
                ...validation,
                error_code: 'CPPI2',
            });
        }

        const [selectedInvoice] = rows;

        const payload = {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            amount: selectedInvoice.price,
            notifyUrl: selectedInvoice.ipaymu_notify_url,
            expired: 1,
            expiredType: 'days',
            referenceId: generateRandomString(10),
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
        if (!response.Success) throw new ValidationError(JSON.stringify(response), 'response-ipaymu');
        const { ReferenceId, TransactionId, QrString } = response.Data;

        const qrString = QrString || '';

        const [invoiceUpdated] = await pool.query('UPDATE invoice SET invoice_code = ?, transaction_id = ?, qr_string = ? WHERE id = ?', [ReferenceId, TransactionId, qrString, id]);
        if (invoiceUpdated.affectedRows < 1) throw new Error('Terjadi kesalahan saat update invoice');

        return res.status(200).json({
            success: true,
            message: 'Berhasil membuat pembayaran!',
            data: {
                invoice: ReferenceId,
                transaction_id: TransactionId,
            },
        });
    } catch (error) {
        if (
            error.code === 'ER_ACCESS_DENIED_ERROR'
            || error.code === 'ER_NO_DB_ERROR'
            || error.code === 'ER_PARSE_ERROR'
        ) {
            return res.status(500).json({
                success: false,
                error_code: 'CPPI3',
                message: 'Terjadi kesalahan pada database.',
            });
        }
        if (error instanceof ValidationError && error.field === 'response-ipaymu') {
            const errorData = JSON.parse(error.message);
            return res.status(errorData.Status || 500).json({
                success: false,
                error_code: 'CPPI4',
                message: errorData.Message,
            });
        }
        return res.status(500).json({
            success: false,
            error_code: 'CPPI5',
            message: error.message,
        });
    }
};

exports.checkInvoice = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM invoice WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error_code: 'CPCI2',
                message: 'Invoice tidak ditemukan.',
            });
        }

        const [selectedInvoice] = rows;

        if (!selectedInvoice.invoice_code || !selectedInvoice.transaction_id) {
            return res.status(404).json({
                success: false,
                error_code: 'CPCI3',
                message: 'Silakan pilih pembayaran dulu.',
            });
        }

        const payload = {
            transactionId: selectedInvoice.transaction_id,
            account: process.env.IPAYMU_VIRTUAL_ACCOUNT,
        };
        const response = await iPaymuAPI({
            endpoint: 'transaction',
            method: 'POST',
            body: payload,
        });
        if (!response.Success) throw new ValidationError(JSON.stringify(response), 'response-ipaymu');
        const {
            ReferenceId,
            Amount,
            Status,
            PaymentChannel,
            PaymentCode,
            ExpiredDate,
            BuyerName,
            BuyerPhone,
            BuyerEmail,
        } = response.Data;
        const externalLinkJSON = JSON.parse(selectedInvoice.external_link);
        const newExternalLink = {
            ...externalLinkJSON,
            ...(Status !== 1 && {
                link: '',
            }),
        };

        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data pembayaran!',
            data: {
                invoice: ReferenceId,
                amount: Amount,
                status: Status,
                payment_channel: PaymentChannel,
                payment_code: PaymentCode,
                expired_date: ExpiredDate,
                buyer_name: BuyerName,
                buyer_phone: BuyerPhone,
                buyer_email: BuyerEmail,
                qr_code: PaymentChannel === 'QRIS' ? selectedInvoice.qr_string : '',
                info_message: JSON.parse(selectedInvoice.info_message),
                external_link: externalLinkJSON.is_active ? newExternalLink : { is_active: false },
            },
        });
    } catch (error) {
        if (
            error.code === 'ER_ACCESS_DENIED_ERROR'
            || error.code === 'ER_NO_DB_ERROR'
            || error.code === 'ER_PARSE_ERROR'
        ) {
            return res.status(500).json({
                success: false,
                error_code: 'CPCI4',
                message: 'Terjadi kesalahan pada database.',
            });
        }
        if (error instanceof ValidationError && error.field === 'response-ipaymu') {
            const errorData = JSON.parse(error.message);
            return res.status(errorData.Status || 500).json({
                success: false,
                error_code: 'CPCI5',
                message: errorData.Message,
            });
        }
        return res.status(500).json({
            success: false,
            error_code: 'CPCI6',
            message: error.message,
        });
    }
};
