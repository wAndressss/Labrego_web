import { randomBytes } from 'node:crypto';
import { priceItems, QUOTE_VALID_DAYS } from '../src/lib/pricing.js';
import { buildQuotePdf, pdfFileName } from '../src/lib/quotePdf.js';
import { handleError, HttpError, rateLimit, readJson, send, siteUrl } from './_lib/http.js';
import { validateQuoteRequest } from './_lib/validate.js';
import { createToken } from './_lib/token.js';
import { sendMail } from './_lib/mailer.js';
import { quoteEmail } from './_lib/emails.js';
import { logoDataUrl } from './_lib/logo.js';

// Referencia corta y legible: LAB-20261030-4F7K (fecha de Colombia)
function createReference(date) {
    const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(date).replace(/-/g, '');
    return `LAB-${ymd}-${randomBytes(3).toString('hex').slice(0, 4).toUpperCase()}`;
}

/**
 * POST /api/quote
 * Calcula la cotización con los precios estándar, genera el PDF y lo envía
 * al correo del cliente con un enlace firmado para confirmar el pedido.
 */
export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') throw new HttpError(405, 'Método no permitido.');
        rateLimit(req);
        const { client, delivery, items } = validateQuoteRequest(await readJson(req));

        const now = new Date();
        const pricing = priceItems(items);
        const data = {
            reference: createReference(now),
            issuedAt: now.toISOString(),
            validUntil: new Date(now.getTime() + QUOTE_VALID_DAYS * 86_400_000).toISOString(),
            client,
            delivery,
            // Se guardan los precios cotizados para respetarlos al confirmar
            items: pricing.lines.map(l => ({
                slug: l.slug, quantity: l.quantity, unit: l.unit, frequency: l.frequency, note: l.note, unitPrice: l.unitPrice,
            })),
        };

        const confirmUrl = `${siteUrl(req)}/confirmar?t=${createToken(data)}`;
        const pdf = buildQuotePdf('quote', { ...data, pricing }, logoDataUrl());
        const email = quoteEmail({ data, pricing, confirmUrl });

        await sendMail({
            to: client.email,
            ...email,
            attachments: [{
                filename: pdfFileName('quote', data.reference),
                content: Buffer.from(pdf.output('arraybuffer')),
                contentType: 'application/pdf',
            }],
        });

        send(res, 200, { reference: data.reference, email: client.email, total: pricing.total, validUntil: data.validUntil });
    } catch (err) {
        handleError(res, err);
    }
}
