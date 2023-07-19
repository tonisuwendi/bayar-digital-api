import CryptoJS from 'crypto-js';
import fetch from 'node-fetch';

import { IPAYMU_API_URL } from './enums.js';

export const iPaymuAPI = ({ endpoint, method = 'GET', body = {} }) => {
    const bodyEncrypt = CryptoJS.SHA256(JSON.stringify(body));
    const stringtosign = `${method}:${process.env.IPAYMU_VIRTUAL_ACCOUNT}:${bodyEncrypt}:${process.env.IPAYMU_API_KEY}`;
    const signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(stringtosign, process.env.IPAYMU_API_KEY));

    return new Promise((resolve, reject) => {
        fetch(`${IPAYMU_API_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                va: process.env.IPAYMU_VIRTUAL_ACCOUNT,
                signature,
                timestamp: Date.now(),
            },
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .then((responseJson) => resolve(responseJson))
            .catch((error) => reject(error));
    });
};
