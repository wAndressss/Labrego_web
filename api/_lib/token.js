import { createHmac, timingSafeEqual } from 'node:crypto';
import { HttpError } from './http.js';

// El enlace "Confirmar pedido" lleva los datos de la cotización firmados con
// QUOTE_SECRET: así no se necesita base de datos y nadie puede alterar
// cantidades ni precios sin invalidar la firma.

function secret() {
    const value = process.env.QUOTE_SECRET;
    if (!value || value.length < 16) {
        throw new HttpError(503, 'El envío de cotizaciones no está configurado todavía (falta QUOTE_SECRET).');
    }
    return value;
}

const b64 = (buf) => Buffer.from(buf).toString('base64url');
const sign = (body) => createHmac('sha256', secret()).update(body).digest();

export function createToken(payload) {
    const body = b64(JSON.stringify(payload));
    return `${body}.${b64(sign(body))}`;
}

export function readToken(token) {
    const [body, signature] = String(token || '').split('.');
    if (!body || !signature) throw new HttpError(400, 'El enlace de confirmación no es válido.');
    const expected = sign(body);
    const given = Buffer.from(signature, 'base64url');
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
        throw new HttpError(400, 'El enlace de confirmación no es válido o fue modificado.');
    }
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
}
