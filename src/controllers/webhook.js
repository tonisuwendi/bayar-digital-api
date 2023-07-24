const { IPAYMU_WHITELIST_IP } = require('../helpers/enums');

exports.ipaymu = async (req, res) => {
    const { headers, connection: { remoteAddress } } = req;
    if (IPAYMU_WHITELIST_IP.includes(headers['x-forwarded-for']) || IPAYMU_WHITELIST_IP.includes(remoteAddress)) {
        res.status(200).json({
            success: true,
            message: 'Berhasil!',
        });
    } else {
        res.status(401).json({
            success: false,
            error_code: 'CWI8',
            message: 'Permintaan Anda ditolak!',
        });
    }
};
