// Utilidades HTTP compartidas por las funciones de /api (Vercel y servidor local)

export async function readJson(req) {
    // Vercel ya entrega el cuerpo JSON leído; el servidor local de Vite no
    if (req.body && typeof req.body === 'object') return req.body;
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
        size += chunk.length;
        if (size > 50_000) throw new HttpError(413, 'La solicitud es demasiado grande.');
        chunks.push(chunk);
    }
    try {
        return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
    } catch {
        throw new HttpError(400, 'Datos inválidos.');
    }
}

export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export function send(res, status, data) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(data));
}

export function handleError(res, err) {
    if (err instanceof HttpError) return send(res, err.status, { error: err.message });
    console.error(err);
    return send(res, 500, { error: 'Ocurrió un error inesperado. Intenta de nuevo en unos minutos.' });
}

/** URL pública del sitio, para los enlaces de los correos */
export function siteUrl(req) {
    if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const proto = req.headers['x-forwarded-proto'] || (host?.startsWith('localhost') ? 'http' : 'https');
    return `${proto}://${host}`;
}

// Límite simple por IP para evitar abuso del envío de correos
const hits = new Map();
export function rateLimit(req, { max = 5, windowMs = 10 * 60_000 } = {}) {
    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'local').split(',')[0].trim();
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter(t => now - t < windowMs);
    if (recent.length >= max) {
        throw new HttpError(429, 'Has enviado varias cotizaciones seguidas. Espera unos minutos e intenta de nuevo.');
    }
    recent.push(now);
    hits.set(ip, recent);
}
