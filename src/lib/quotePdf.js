import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { findProduct } from '../data/products';
import { EMAIL, OFFICE_HOURS_TEXT, WHATSAPP_DISPLAY } from '../data/contact';

// Colores de marca en RGB
const GREEN_DARK = [31, 48, 16];
const GREEN = [61, 90, 31];
const ACCENT = [152, 191, 34];
const PAPER = [247, 240, 223];
const MUTED = [90, 107, 74];
const INK = [28, 43, 10];

const MARGIN = 16;

// Fecha legible en español: "30 de octubre de 2026"
const formatDate = (date) => new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(date);

const formatIsoDate = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    return formatDate(new Date(y, m - 1, d));
};

async function loadImage(src) {
    try {
        const blob = await (await fetch(src)).blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch {
        return null;
    }
}

export const quotePdfFileName = (reference) => `Cotizacion-${reference}.pdf`;

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
 * Genera el PDF de la solicitud de cotización y lo descarga.
 * Devuelve el documento por si se necesita reutilizar.
 */
export async function downloadQuotePdf(draft, reference, date = new Date()) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const contentW = pageW - MARGIN * 2;

    doc.setProperties({
        title: `Solicitud de cotización ${reference}`,
        author: 'Labrego S.A.S.',
        subject: 'Solicitud de cotización',
    });

    // ---------- Encabezado ----------
    doc.setFillColor(...ACCENT);
    doc.rect(0, 0, pageW, 3, 'F');

    const logo = await loadImage('/logo-dark.png');
    if (logo) {
        doc.addImage(logo, 'PNG', MARGIN, 9, 30, 19.7);
    } else {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(...GREEN);
        doc.text('LABREGO', MARGIN, 22);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.setTextColor(...GREEN_DARK);
    doc.text('SOLICITUD DE COTIZACIÓN', pageW - MARGIN, 16, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...MUTED);
    doc.text(`Referencia: ${reference}`, pageW - MARGIN, 22.5, { align: 'right' });
    doc.text(`Fecha: ${formatDate(date)}`, pageW - MARGIN, 27.5, { align: 'right' });

    doc.setDrawColor(...ACCENT);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, 34, pageW - MARGIN, 34);

    // ---------- Cliente y entrega ----------
    const colW = (contentW - 6) / 2;
    const top = 40;
    const h1 = infoBox(doc, MARGIN, top, colW, 'Datos del cliente', [
        ['Nombre', draft.name],
        ['Cargo', draft.role],
        ['Empresa', draft.company],
        ['NIT', draft.nit],
        ['Teléfono', draft.phone],
        ['Correo', draft.email],
    ]);
    const h2 = infoBox(doc, MARGIN + colW + 6, top, colW, 'Entrega', [
        ['Ciudad', draft.city],
        ['Primera entrega', formatIsoDate(draft.startDate) || 'Por definir'],
        ['Tipo de cliente', draft.clientType],
    ]);

    // ---------- Productos ----------
    let y = top + Math.max(h1, h2) + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...GREEN_DARK);
    doc.text('Productos solicitados', MARGIN, y);

    autoTable(doc, {
        startY: y + 3,
        margin: { left: MARGIN, right: MARGIN },
        head: [['#', 'Producto', 'Cantidad', 'Frecuencia', 'Detalle']],
        body: draft.items.map((it, i) => {
            const p = findProduct(it.slug);
            return [
                String(i + 1),
                `${p.name}\n${p.category}`,
                `${it.quantity} ${it.unit}`,
                it.frequency,
                it.note || '—',
            ];
        }),
        theme: 'plain',
        styles: { font: 'helvetica', fontSize: 9, cellPadding: 3, textColor: INK, valign: 'middle' },
        headStyles: { fillColor: GREEN, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
        alternateRowStyles: { fillColor: PAPER },
        columnStyles: {
            0: { cellWidth: 9, halign: 'center', textColor: MUTED },
            1: { cellWidth: 52, fontStyle: 'bold' },
            2: { cellWidth: 30 },
            3: { cellWidth: 28 },
            4: { textColor: MUTED },
        },
    });
    y = doc.lastAutoTable.finalY + 8;

    // ---------- Observaciones ----------
    if (draft.notes) {
        const lines = doc.splitTextToSize(draft.notes, contentW - 10);
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

    // ---------- Nota ----------
    if (y > pageH - 50) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text(doc.splitTextToSize(
        'Este documento es una solicitud de cotización, no una factura ni una orden de compra. '
        + 'Los precios dependen del volumen, la frecuencia y la temporada. Nuestro equipo comercial '
        + 'enviará la propuesta en menos de 24 horas hábiles.',
        contentW,
    ), MARGIN, y);

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

    doc.save(quotePdfFileName(reference));
    return doc;
}
