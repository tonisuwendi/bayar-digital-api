const IPAYMU_PAYMENT_CODE = {
    VA: 'va',
    BAG: 'bag',
    BCA: 'bca',
    BNI: 'bni',
    CIMB: 'cimb',
    MANDIRI: 'mandiri',
    BMI: 'bmi',
    BRI: 'bri',
    BSI: 'bsi',
    PERMATA: 'permata',
    DANAMON: 'danamon',
    CSTORE: 'cstore',
    ALFAMARTA: 'alfamart',
    INDOMARET: 'indomaret',
    QRIS: 'qris',
};

const IPAYMU_API_URL = `${process.env.IPAYMU_URL}api/v2/`;

const WEBHOOK_IPAYMU = `${process.env.DOMAIN_URL}webhook/ipaymu`;

const IPAYMU_WHITELIST_IP = process.env.NODE_PRODUCTION === 'true'
    ? ['120.89.93.249', '120.89.93.222']
    : ['120.89.93.102', '120.89.93.225', '34.101.178.210'];

module.exports = {
    IPAYMU_PAYMENT_CODE,
    IPAYMU_API_URL,
    WEBHOOK_IPAYMU,
    IPAYMU_WHITELIST_IP,
};
