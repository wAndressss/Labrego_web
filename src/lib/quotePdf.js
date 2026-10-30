import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCOP, formatQuantity } from '../data/products.js';
import { EMAIL, OFFICE_HOURS_TEXT, WHATSAPP_DISPLAY } from '../data/contact.js';

// Colores de marca en RGB
const GREEN_DARK = [31, 48, 16];
const GREEN = [61, 90, 31];
const ACCENT = [152, 191, 34];
const PAPER = [247, 240, 223];
const MUTED = [90, 107, 74];
const INK = [28, 43, 10];

const MARGIN = 16;

// Fechas siempre en hora de Colombia: "30 de octubre de 2026"
const formatDate = (date) => new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeZone: 'America/Bogota' }).format(new Date(date));

const formatIsoDate = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
};

const KINDS = {
    quote: { title: 'COTIZACIÓN', file: 'Cotizacion' },
    order: { title: 'ORDEN DE VENTA', file: 'Orden-de-venta' },
};

export const pdfFileName = (kind, reference) => `${KINDS[kind].file}-${reference}.pdf`;

/** Dibuja un recuadro con título y pares etiqueta/valor; devuelve su alto */
function infoBox(doc, x, y, w, title, rows) {
    const lineH = 5.2;
    const visible = rows.filter(([, v]) => v);
    const wrapped = visible.map(([label, value]) => [label, doc.splitTextToSize(String(value), w - 40)]);
    const h = 12 + wrapped.reduce((sum, [, lines]) => sum + lines.length * lineH, 0) + 3;

    doc.setFillColor(...PAPER);
    doc.roundedRect(x, y, w, h, 2.5, 2.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...GREEN);
    doc.text(title.toUpperCase(), x + 5, y + 7);

    let cy = y + 13;
    wrapped.forEach(([label, lines]) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...MUTED);
        doc.text(label, x + 5, cy);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...INK);
        doc.text(lines, x + 35, cy);
        cy += lines.length * lineH;
    });
    return h;
}

/**
 * Arma el PDF de una cotización (kind: 'quote') o de una orden de venta
 * (kind: 'order'). Funciona en el navegador y en el servidor.
 *
 * data: { reference, issuedAt, validUntil, confirmedAt?, client, delivery, pricing }
 * logo: imagen PNG en data URL (opcional)
 */
export function buildQuotePdf(kind, data, logo) {
    const { reference, issuedAt, validUntil, confirmedAt, client, delivery, pricing } = data;
    const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const contentW = pageW - MARGIN * 2;

    doc.setProperties({
        title: `${KINDS[kind].title} ${reference}`,
        author: 'Labrego S.A.S.',
    });

    // ---------- Encabezado ----------
    doc.setFillColor(...ACCENT);
    doc.rect(0, 0, pageW, 3, 'F');

    if (logo) {
        doc.addImage(logo, 'PNG', MARGIN, 9, 30, 19.7, 'logo', 'FAST');
    } else {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(...GREEN);
        doc.text('LABREGO', MARGIN, 22);
    }

    const meta = kind === 'order'
        ? [`Orden: ${reference}`, `Confirmada: ${formatDate(confirmedAt)}`, `Cotización del ${formatDate(issuedAt)}`]
        : [`Referencia: ${reference}`, `Fecha: ${formatDate(issuedAt)}`, `Válida hasta: ${formatDate(validUntil)}`];

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...GREEN_DARK);
    doc.text(KINDS[kind].title, pageW - MARGIN, 15, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    meta.forEach((line, i) => doc.text(line, pageW - MARGIN, 21 + i * 4.6, { align: 'right' }));

    doc.setDrawColor(...ACCENT);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, 36, pageW - MARGIN, 36);

    // ---------- Cliente y entrega ----------
    const colW = (contentW - 6) / 2;
    const top = 42;
    const h1 = infoBox(doc, MARGIN, top, colW, 'Cliente', [
        ['Nombre', client.name],
        ['Cargo', client.role],
        ['Empresa', client.company],
        ['NIT', client.nit],
        ['Teléfono', client.phone],
        ['Correo', client.email],
    ]);
    const h2 = infoBox(doc, MARGIN + colW + 6, top, colW, 'Entrega', [
        ['Ciudad', delivery.city],
        ['Primera entrega', formatIsoDate(delivery.startDate) || 'Por definir'],
        ['Tipo de cliente', delivery.clientType],
    ]);

    // ---------- Productos con precios ----------
    let y = top + Math.max(h1, h2) + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...GREEN_DARK);
    doc.text('Productos', MARGIN, y);

    autoTable(doc, {
        startY: y + 3,
        margin: { left: MARGIN, right: MARGIN },
        head: [['#', 'Producto', 'Cantidad', 'Frecuencia', 'Precio / kg', 'Subtotal']],
        body: pricing.lines.map((l, i) => [
            String(i + 1),
            l.note ? `${l.name}\n${l.note}` : l.name,
            `${formatQuantity(l.quantity)} ${l.unit}`,
            l.frequency,
            l.unitPrice === null ? 'A convenir' : formatCOP(l.unitPrice),
            l.subtotal === null ? 'A convenir' : formatCOP(l.subtotal),
        ]),
        foot: [[
            '',
            { content: 'Total por entrega', colSpan: 4 },
            { content: formatCOP(pricing.total), styles: { halign: 'right' } },
        ]],
        theme: 'plain',
        styles: { font: 'helvetica', fontSize: 9, cellPadding: 3, textColor: INK, valign: 'middle' },
        headStyles: { fillColor: GREEN, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
        footStyles: { fillColor: GREEN_DARK, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
        alternateRowStyles: { fillColor: PAPER },
        columnStyles: {
            0: { cellWidth: 8, halign: 'center', textColor: MUTED },
            1: { cellWidth: 50, fontStyle: 'bold' },
            2: { cellWidth: 26 },
            3: { cellWidth: 26 },
            4: { halign: 'right' },
            5: { halign: 'right', fontStyle: 'bold' },
        },
    });
    y = doc.lastAutoTable.finalY + 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    const priceNotes = [
        'Valores en pesos colombianos (COP), calculados con los precios estándar por kilo.',
        pricing.hasUnpriced ? 'Los productos "a convenir" se cotizan aparte y no están incluidos en el total.' : null,
    ].filter(Boolean);
    doc.text(priceNotes, MARGIN, y);
    y += priceNotes.length * 4 + 6;

    // ---------- Observaciones ----------
    if (delivery.notes) {
        const lines = doc.splitTextToSize(delivery.notes, contentW - 10);
        const h = 12 + lines.length * 4.6;
        if (y + h > pageH - 40) { doc.addPage(); y = 20; }
        doc.setFillColor(...PAPER);
        doc.roundedRect(MARGIN, y, contentW, h, 2.5, 2.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...GREEN);
        doc.text('OBSERVACIONES', MARGIN + 5, y + 7);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...INK);
        doc.text(lines, MARGIN + 5, y + 12.5);
        y += h + 8;
    }

    // ---------- Nota final ----------
    if (y > pageH - 50) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    const closing = kind === 'order'
        ? 'El cliente confirmó esta cotización desde el enlace enviado a su correo. Coordinar disponibilidad, '
            + 'despacho y facturación con el cliente.'
        : 'Para aceptar esta cotización usa el botón "Confirmar pedido" del correo que la acompaña. '
            + 'Al confirmarla, nuestro equipo recibe la orden de venta y te contactará para coordinar la entrega.';
    doc.text(doc.splitTextToSize(closing, contentW), MARGIN, y);

    // ---------- Pie de página en todas las hojas ----------
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFillColor(...GREEN_DARK);
        doc.rect(0, pageH - 20, pageW, 20, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text('Labrego S.A.S.', MARGIN, pageH - 12.5);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(214, 230, 170);
        doc.text(`WhatsApp ${WHATSAPP_DISPLAY}  ·  ${EMAIL}  ·  Trujillo, Valle del Cauca`, MARGIN, pageH - 7.5);
        doc.text(OFFICE_HOURS_TEXT, pageW - MARGIN, pageH - 12.5, { align: 'right' });
        doc.text(`Página ${i} de ${pages}`, pageW - MARGIN, pageH - 7.5, { align: 'right' });
    }

    return doc;
}

/** En el navegador: arma el PDF y lo descarga */
export async function downloadPdf(kind, data) {
    let logo = null;
    try {
        const blob = await (await fetch('/logo-dark.png')).blob();
        logo = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch {
        /* sin logo: se usa el texto LABREGO */
    }
    buildQuotePdf(kind, data, logo).save(pdfFileName(kind, data.reference));
}
