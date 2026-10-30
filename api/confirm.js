import { priceItems } from '../src/lib/pricing.js';
import { buildQuotePdf, pdfFileName } from '../src/lib/quotePdf.js';
import { handleError, HttpError, readJson, send } from './_lib/http.js';
import { readToken } from './_lib/token.js';
import { ordersInbox, sendMail } from './_lib/mailer.js';
import { orderEmail, orderReceivedEmail } from './_lib/emails.js';
import { logoDataUrl } from './_lib/logo.js';

const orderRefFor = (quoteRef) => quoteRef.replace(/^LAB-/, 'OV-');

function summary(data) {
    const pricing = priceItems(data.items);
    return {
        reference: data.reference,
        orderRef: orderRefFor(data.reference),
        issuedAt: data.issuedAt,
        validUntil: data.validUntil,
        expired: Date.now() > new Date(data.validUntil).getTime(),
        client: { name: data.client.name, company: data.client.company, email: data.client.email },
        city: data.delivery.city,
        pricing,
    };
}

/**
 * GET  /api/confirm?t=...  → muestra el resumen de la cotización (no envía nada,
 *                            así los antivirus de correo que abren enlaces no
 *                            confirman pedidos por error)
 * POST /api/confirm {t}    → confirma: envía la orden de venta a la empresa y
 *                            un aviso al cliente, ambos con PDF
 */
export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const url = new URL(req.url, 'http://localhost');
            return send(res, 200, summary(readToken(url.searchParams.get('t'))));
        }
        if (req.method !== 'POST') throw new HttpError(405, 'Método no permitido.');

        const data = readToken((await readJson(req)).t);
        const info = summary(data);
        if (info.expired) {
            throw new HttpError(410, 'Esta cotización ya venció. Solicita una nueva desde la página para tener precios actualizados.');
        }

        const confirmedAt = new Date().toISOString();
        const pdfData = { ...data, reference: info.orderRef, confirmedAt, pricing: info.pricing };
        const pdf = Buffer.from(buildQuotePdf('order', pdfData, logoDataUrl()).output('arraybuffer'));
        const attachment = { filename: pdfFileName('order', info.orderRef), content: pdf, contentType: 'application/pdf' };

        await sendMail({
            to: ordersInbox(),
            replyTo: data.client.email,
            ...orderEmail({ data, pricing: info.pricing, orderRef: info.orderRef }),
            attachments: [attachment],
        });
        await sendMail({
            to: data.client.email,
            ...orderReceivedEmail({ data, orderRef: info.orderRef }),
            attachments: [attachment],
        });

        send(res, 200, { ok: true, orderRef: info.orderRef });
    } catch (err) {
        handleError(res, err);
    }
}
