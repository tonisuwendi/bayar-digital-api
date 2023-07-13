import invoices from '../data/invoice.js';

export const getInvoice = (req, res) => {
    const { id } = req.params;
    const selectedInvoice = invoices.find((invoice) => invoice.id === id);
    if (!selectedInvoice) {
        res.status(404).json({
            success: false,
            message: 'Invoice tidak ditemukan.',
        });
        return;
    }

    const {
        id: invoiceId, title, price, banner, thumbnail,
    } = selectedInvoice;
    res.status(200).json({
        success: true,
        message: 'Berhasil mengambil data invoice!',
        data: {
            id: invoiceId,
            title,
            price,
            banner,
            thumbnail,
        },
    });
};
