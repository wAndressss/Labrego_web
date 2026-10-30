import nodemailer from 'nodemailer';
import { HttpError } from './http.js';

// Correo de la empresa: envía las cotizaciones y recibe las órdenes de venta.
// Configuración por variables de entorno (ver .env.example):
//   SMTP_USER / SMTP_PASS  → cuenta de Gmail y su "contraseña de aplicación"
//   ORDERS_EMAIL           → a dónde llegan las órdenes (por defecto SMTP_USER)
//   MAIL_TRANSPORT=json    → solo para pruebas: no envía, devuelve el mensaje

let transport;

function getTransport() {
    if (transport) return transport;
    if (process.env.MAIL_TRANSPORT === 'json') {
        transport = nodemailer.createTransport({ jsonTransport: true });
    } else if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT || 465),
            secure: true,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });
    } else {
        throw new HttpError(503, 'El envío de correos no está configurado todavía (faltan SMTP_USER y SMTP_PASS).');
    }
    return transport;
}

export const ordersInbox = () => process.env.ORDERS_EMAIL || process.env.SMTP_USER || 'labregooficial@gmail.com';

export async function sendMail({ to, subject, html, text, attachments, replyTo }) {
    const from = `"Labrego" <${process.env.SMTP_USER || 'labregooficial@gmail.com'}>`;
    const info = await getTransport().sendMail({ from, to, subject, html, text, attachments, replyTo });
    if (process.env.MAIL_TRANSPORT === 'json') {
        const msg = JSON.parse(info.message);
        console.info(`[correo de prueba] para ${msg.to?.map?.(t => t.address).join(', ')}: ${msg.subject}`);
    }
    return info;
}
