import { IPAYMU_PAYMENT_CODE } from './enums.js';

export const iPaymuValidPayment = (paymentMethod, paymentChannel) => {
    const validPaymentVA = [
        IPAYMU_PAYMENT_CODE.BAG,
        IPAYMU_PAYMENT_CODE.BCA,
        IPAYMU_PAYMENT_CODE.BNI,
        IPAYMU_PAYMENT_CODE.CIMB,
        IPAYMU_PAYMENT_CODE.MANDIRI,
        IPAYMU_PAYMENT_CODE.BMI,
        IPAYMU_PAYMENT_CODE.BRI,
        IPAYMU_PAYMENT_CODE.BSI,
        IPAYMU_PAYMENT_CODE.PERMATA,
        IPAYMU_PAYMENT_CODE.DANAMON,
    ];
    if (paymentMethod === IPAYMU_PAYMENT_CODE.VA && validPaymentVA.includes(paymentChannel)) return true;

    const validPaymentCS = [IPAYMU_PAYMENT_CODE.ALFAMARTA, IPAYMU_PAYMENT_CODE.INDOMARET];
    if (paymentMethod === IPAYMU_PAYMENT_CODE.CSTORE && validPaymentCS.includes(paymentChannel)) return true;

    return paymentMethod === IPAYMU_PAYMENT_CODE.QRIS && paymentChannel === IPAYMU_PAYMENT_CODE.QRIS;
};

export const handleValidatePayInvoice = ({
    name, phone, email, paymentMethod, paymentChannel,
}) => {
    let errorData = {};

    if (!name || name.trim() === '') errorData = { ...errorData, name: 'Nama harus diisi.' };

    if (!phone || phone.trim() === '') errorData = { ...errorData, phone: 'No WhatsApp harus diisi.' };

    if (!email || email.trim() === '') errorData = { ...errorData, email: 'Email harus diisi.' };

    if (!iPaymuValidPayment(paymentMethod, paymentChannel)) errorData = { ...errorData, payment: 'Metode pembayaran tidak tersedia. Pilih metode pembayaran lain.' };

    return {
        success: Object.keys(errorData).length === 0,
        message: 'Terdapat data yang tidak sesuai.',
        errors: errorData,
    };
};

export const generateRandomString = (length = 5) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
};

export class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.field = field;
    }
}
