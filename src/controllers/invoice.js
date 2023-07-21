const pool = require('../config/database');

exports.getInvoice = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM invoice WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error_code: 'CIGI1',
                message: 'Invoice tidak ditemukan.',
            });
        }

        const {
            id: invoiceId, title, price, evidence, thumbnail,
        } = rows[0];
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data invoice!',
            data: {
                id: invoiceId,
                title,
                price,
                evidence,
                thumbnail,
            },
        });
    } catch (error) {
        if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ER_NO_DB_ERROR') {
            return res.status(500).json({
                success: false,
                error_code: 'CIGI2',
                message: 'Terjadi kesalahan saat mengambil invoice ke database.',
            });
        }
        return res.status(500).json({
            success: false,
            error_code: 'CIGI3',
            message: 'Terjadi kesalahan saat mengambil invoice ke database.',
        });
    }
};
