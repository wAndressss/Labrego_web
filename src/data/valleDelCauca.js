// Lugares de entrega en el Valle del Cauca: los 42 municipios y los
// corregimientos más conocidos (con el municipio al que pertenecen).
// El campo de ciudad acepta también cualquier otro lugar escrito a mano.

export const MUNICIPIOS = [
    'Alcalá', 'Andalucía', 'Ansermanuevo', 'Argelia', 'Bolívar', 'Buenaventura',
    'Bugalagrande', 'Caicedonia', 'Cali', 'Calima (El Darién)', 'Candelaria', 'Cartago',
    'Dagua', 'El Águila', 'El Cairo', 'El Cerrito', 'El Dovio', 'Florida', 'Ginebra',
    'Guacarí', 'Guadalajara de Buga', 'Jamundí', 'La Cumbre', 'La Unión', 'La Victoria',
    'Obando', 'Palmira', 'Pradera', 'Restrepo', 'Riofrío', 'Roldanillo', 'San Pedro',
    'Sevilla', 'Toro', 'Trujillo', 'Tuluá', 'Ulloa', 'Versalles', 'Vijes', 'Yotoco',
    'Yumbo', 'Zarzal',
];

// [corregimiento, municipio]
export const CORREGIMIENTOS = [
    ['Amaime', 'Palmira'],
    ['Rozo', 'Palmira'],
    ['La Buitrera', 'Cali'],
    ['Pance', 'Cali'],
    ['Villagorgona', 'Candelaria'],
    ['El Carmelo', 'Candelaria'],
    ['Juanchaco', 'Buenaventura'],
    ['Ladrilleros', 'Buenaventura'],
    ['El Queremal', 'Dagua'],
    ['Borrero Ayerbe', 'Dagua'],
    ['Potrerito', 'Jamundí'],
    ['Robles', 'Jamundí'],
    ['Mediacanoa', 'Yotoco'],
    ['Sonso', 'Guacarí'],
    ['Costa Rica', 'Ginebra'],
    ['La Paila', 'Zarzal'],
    ['Ceilán', 'Bugalagrande'],
    ['Andinápolis', 'Trujillo'],
    ['Venecia', 'Trujillo'],
    ['Salónica', 'Riofrío'],
    ['Fenicia', 'Riofrío'],
];

/** Lista para el buscador: { label, detail } */
export const VALLE_PLACES = [
    ...MUNICIPIOS.map(m => ({ label: m, detail: 'Municipio' })),
    ...CORREGIMIENTOS.map(([c, m]) => ({ label: `${c} (${m})`, detail: `Corregimiento de ${m}` })),
].sort((a, b) => a.label.localeCompare(b.label, 'es'));
