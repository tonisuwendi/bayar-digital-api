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

module.exports = {
    IPAYMU_PAYMENT_CODE,
    IPAYMU_API_URL,
};
