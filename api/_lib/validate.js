import { findProduct, UNIT_TO_KG } from '../../src/data/products.js';
import { CLIENT_TYPES, FREQUENCIES } from '../../src/data/quoteOptions.js';
import { HttpError } from './http.js';

const text = (value, max) => String(value ?? '').trim().slice(0, max);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Revisa y limpia los datos que llegan del formulario de cotización */
export function validateQuoteRequest(body) {
    // Campo trampa invisible: si viene lleno, lo envió un robot
    if (body?.website) throw new HttpError(400, 'Solicitud rechazada.');

    const client = {
        name: text(body?.client?.name, 120),
        role: text(body?.client?.role, 80),
        company: text(body?.client?.company, 120),
        nit: text(body?.client?.nit, 30),
        phone: text(body?.client?.phone, 30),
        email: text(body?.client?.email, 120).toLowerCase(),
    };
    const delivery = {
        city: text(body?.delivery?.city, 120),
        startDate: /^\d{4}-\d{2}-\d{2}$/.test(body?.delivery?.startDate || '') ? body.delivery.startDate : '',
        clientType: CLIENT_TYPES.includes(body?.delivery?.clientType) ? body.delivery.clientType : '',
        notes: text(body?.delivery?.notes, 1000),
    };

    if (!client.name) throw new HttpError(400, 'Falta el nombre.');
    if (!EMAIL_RE.test(client.email)) throw new HttpError(400, 'El correo no es válido.');
    if (client.phone.replace(/\D/g, '').length < 7) throw new HttpError(400, 'El teléfono no es válido.');
    if (!delivery.city) throw new HttpError(400, 'Falta la ciudad de entrega.');
    if (!delivery.clientType) throw new HttpError(400, 'Falta el tipo de cliente.');

    const rawItems = Array.isArray(body?.items) ? body.items.slice(0, 20) : [];
    const items = rawItems.map(it => {
        const quantity = Number(it?.quantity);
        if (!findProduct(it?.slug)) throw new HttpError(400, 'Hay un producto que no existe en el catálogo.');
        if (!(quantity > 0 && quantity <= 1_000_000)) throw new HttpError(400, 'Revisa las cantidades.');
        if (!(it?.unit in UNIT_TO_KG)) throw new HttpError(400, 'Unidad no válida.');
        if (!FREQUENCIES.includes(it?.frequency)) throw new HttpError(400, 'Frecuencia no válida.');
        return { slug: it.slug, quantity, unit: it.unit, frequency: it.frequency, note: text(it?.note, 200) };
    });
    if (!items.length) throw new HttpError(400, 'Agrega al menos un producto.');

    return { client, delivery, items };
}
