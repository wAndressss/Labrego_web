import { findProduct, UNIT_TO_KG } from '../data/products.js';

// Cuántos días es válida una cotización antes de confirmarla
export const QUOTE_VALID_DAYS = 8;

/**
 * Calcula los valores de una cotización con los precios estándar por kilo.
 * Se usa en la página (vista previa) y en el servidor (valor oficial).
 * Los productos sin precio quedan "a convenir" y no suman al total.
 */
export function priceItems(items) {
    const lines = items.map(it => {
        const product = findProduct(it.slug);
        const quantity = Number(it.quantity) || 0;
        const kg = quantity * (UNIT_TO_KG[it.unit] ?? 1);
        // Una cotización ya enviada conserva el precio con el que se cotizó
        const unitPrice = it.unitPrice !== undefined ? it.unitPrice : (product?.price ?? null);
        return {
            slug: it.slug,
            name: product?.name ?? it.slug,
            category: product?.category ?? '',
            quantity,
            unit: it.unit,
            frequency: it.frequency,
            note: it.note || '',
            kg,
            unitPrice,
            subtotal: unitPrice === null ? null : Math.round(kg * unitPrice),
        };
    });
    const total = lines.reduce((sum, l) => sum + (l.subtotal ?? 0), 0);
    const hasUnpriced = lines.some(l => l.subtotal === null);
    return { lines, total, hasUnpriced };
}
