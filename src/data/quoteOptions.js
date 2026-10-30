import { UNIT_TO_KG } from './products.js';

// Opciones del formulario de cotización (las valida también el servidor)

// Solo unidades convertibles a kilos, porque los precios son por kilo
export const UNITS = Object.keys(UNIT_TO_KG);

export const FREQUENCIES = ['Pedido único', 'Semanal', 'Quincenal', 'Mensual'];
export const DEFAULT_FREQUENCY = 'Semanal';

export const CLIENT_TYPES = [
    'Supermercado / Retail',
    'Plaza de mercado',
    'Mayorista / Distribuidor',
    'Industria procesadora',
    'Restaurante / Foodservice',
    'Exportación',
    'Otro',
];
