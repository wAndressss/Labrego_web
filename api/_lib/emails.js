import { formatCOP, formatQuantity } from '../../src/data/products.js';
import { EMAIL, OFFICE_HOURS_TEXT, WHATSAPP_DISPLAY } from '../../src/data/contact.js';

// Plantillas HTML de los correos. Todo dato escrito por el cliente pasa por
// escapeHtml antes de entrar al HTML.

export const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatDate = (iso) => new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeZone: 'America/Bogota' }).format(new Date(iso));

function layout(title, body) {
    return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;background:#f4efe1;font-family:Arial,Helvetica,sans-serif;color:#1c2b0a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe1;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
<tr><td style="background:#1f3010;padding:22px 28px;">
<span style="font-size:22px;font-weight:bold;letter-spacing:3px;color:#ffffff;">LABREGO</span>
<span style="display:block;font-size:13px;color:#b3d63e;margin-top:4px;font-style:italic;">Cultivamos calidad. Cosechamos confianza.</span>
</td></tr>
<tr><td style="padding:28px;">${body}</td></tr>
<tr><td style="background:#f7f0df;padding:18px 28px;font-size:12px;color:#5a6b4a;line-height:1.6;">
<strong style="color:#1f3010;">Labrego S.A.S.</strong> · Trujillo, Valle del Cauca<br>
WhatsApp ${escapeHtml(WHATSAPP_DISPLAY)} · ${escapeHtml(EMAIL)}<br>
${escapeHtml(OFFICE_HOURS_TEXT)}
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function linesTable(pricing) {
    const rows = pricing.lines.map(l => `
<tr>
<td style="padding:10px 8px;border-bottom:1px solid #eee5cf;"><strong>${escapeHtml(l.name)}</strong>${l.note ? `<br><span style="font-size:12px;color:#5a6b4a;">${escapeHtml(l.note)}</span>` : ''}</td>
<td style="padding:10px 8px;border-bottom:1px solid #eee5cf;white-space:nowrap;">${formatQuantity(l.quantity)} ${escapeHtml(l.unit)}<br><span style="font-size:12px;color:#5a6b4a;">${escapeHtml(l.frequency)}</span></td>
<td style="padding:10px 8px;border-bottom:1px solid #eee5cf;text-align:right;white-space:nowrap;">${l.subtotal === null ? 'A convenir' : formatCOP(l.subtotal)}</td>
</tr>`).join('');
    return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse;margin:18px 0 6px;">
<tr style="background:#3d5a1f;color:#ffffff;font-size:12px;">
<td style="padding:8px;">Producto</td><td style="padding:8px;">Cantidad</td><td style="padding:8px;text-align:right;">Subtotal</td>
</tr>${rows}
<tr><td colspan="2" style="padding:12px 8px;font-weight:bold;">Total por entrega</td>
<td style="padding:12px 8px;text-align:right;font-weight:bold;font-size:16px;color:#1f3010;white-space:nowrap;">${formatCOP(pricing.total)}</td></tr>
</table>
${pricing.hasUnpriced ? '<p style="font-size:12px;color:#5a6b4a;margin:0 0 12px;">Los productos "a convenir" se cotizan aparte y no están incluidos en el total.</p>' : ''}`;
}

function button(href, label) {
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0;"><tr><td style="background:#3d5a1f;border-radius:999px;">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-weight:bold;font-size:15px;text-decoration:none;">${escapeHtml(label)}</a>
</td></tr></table>`;
}

/** Correo al cliente con la cotización y el botón para confirmarla */
export function quoteEmail({ data, pricing, confirmUrl }) {
    const name = escapeHtml(data.client.name.split(' ')[0]);
    const html = layout(`Cotización ${data.reference}`, `
<h1 style="font-size:22px;margin:0 0 8px;color:#1f3010;">Hola ${name}, aquí está tu cotización</h1>
<p style="font-size:14px;line-height:1.6;color:#5a6b4a;margin:0;">
Referencia <strong style="color:#1f3010;">${escapeHtml(data.reference)}</strong> · válida hasta el ${formatDate(data.validUntil)}.
Adjuntamos el PDF con el detalle completo.</p>
${linesTable(pricing)}
<p style="font-size:14px;line-height:1.6;margin:18px 0 0;">Entrega en <strong>${escapeHtml(data.delivery.city)}</strong>.
Si estás de acuerdo, confirma el pedido y nuestro equipo te contactará para coordinar la entrega.</p>
${button(confirmUrl, 'Confirmar pedido')}
<p style="font-size:12px;line-height:1.6;color:#5a6b4a;margin:0;">¿Quieres cambiar algo? Responde este correo o escríbenos por WhatsApp al ${escapeHtml(WHATSAPP_DISPLAY)}.</p>`);
    const text = `Hola ${data.client.name}, aquí está tu cotización ${data.reference} (válida hasta el ${formatDate(data.validUntil)}).\n`
        + `Total por entrega: ${formatCOP(pricing.total)}.\nPara confirmar el pedido abre: ${confirmUrl}\n`;
    return { subject: `Tu cotización Labrego ${data.reference}`, html, text };
}

/** Correo a la empresa con la orden de venta confirmada */
export function orderEmail({ data, pricing, orderRef }) {
    const c = data.client;
    const rows = [
        ['Cliente', c.name], ['Cargo', c.role], ['Empresa', c.company], ['NIT', c.nit],
        ['Teléfono', c.phone], ['Correo', c.email], ['Ciudad de entrega', data.delivery.city],
        ['Primera entrega', data.delivery.startDate], ['Tipo de cliente', data.delivery.clientType],
        ['Observaciones', data.delivery.notes],
    ].filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:5px 0;color:#5a6b4a;width:140px;vertical-align:top;">${k}</td><td style="padding:5px 0;font-weight:bold;">${escapeHtml(v)}</td></tr>`).join('');
    const html = layout(`Orden de venta ${orderRef}`, `
<p style="display:inline-block;background:#e9f5d0;color:#3d5a1f;font-weight:bold;font-size:12px;padding:6px 12px;border-radius:999px;margin:0 0 12px;">NUEVA ORDEN DE VENTA</p>
<h1 style="font-size:22px;margin:0 0 8px;color:#1f3010;">${escapeHtml(c.company || c.name)} confirmó su pedido</h1>
<p style="font-size:14px;line-height:1.6;color:#5a6b4a;margin:0 0 14px;">Orden <strong style="color:#1f3010;">${escapeHtml(orderRef)}</strong>, basada en la cotización ${escapeHtml(data.reference)} del ${formatDate(data.issuedAt)}.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;">${rows}</table>
${linesTable(pricing)}
<p style="font-size:13px;color:#5a6b4a;margin:0;">Responde este correo para escribirle directamente al cliente. El PDF de la orden va adjunto.</p>`);
    const text = `Nueva orden de venta ${orderRef} de ${c.company || c.name} (${c.phone}, ${c.email}). Total por entrega: ${formatCOP(pricing.total)}.`;
    return { subject: `Nueva orden de venta ${orderRef} — ${c.company || c.name}`, html, text };
}

/** Correo al cliente avisando que recibimos su confirmación */
export function orderReceivedEmail({ data, orderRef }) {
    const name = escapeHtml(data.client.name.split(' ')[0]);
    const html = layout(`Pedido confirmado ${orderRef}`, `
<h1 style="font-size:22px;margin:0 0 8px;color:#1f3010;">¡Gracias ${name}! Recibimos tu pedido</h1>
<p style="font-size:14px;line-height:1.6;color:#5a6b4a;margin:0;">Tu orden <strong style="color:#1f3010;">${escapeHtml(orderRef)}</strong> quedó registrada.
Nuestro equipo comercial te contactará en horario de oficina para coordinar la entrega en ${escapeHtml(data.delivery.city)}.
Adjuntamos la orden de venta en PDF.</p>`);
    return { subject: `Pedido confirmado ${orderRef} — Labrego`, html, text: `Recibimos tu pedido ${orderRef}. Te contactaremos para coordinar la entrega.` };
}
