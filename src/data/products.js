// Catálogo central: lo usan /productos y /cotizar.
// Cada producto tiene su propia imagen en public/productos/

export const catalog = [
    {
        id: 1,
        slug: 'aguacate-comun',
        name: 'Aguacate Común',
        tagline: 'Cremoso y de sabor tradicional',
        category: 'Frutas Frescas',
        description: 'Aguacate criollo antillano de pulpa cremosa y sabor tradicional. Ideal para consumo fresco y mercados mayoristas en plaza.',
        // Precio estándar en COP por kilo (null = a convenir)
        price: 7500,
        facts: [
            ['Presentación', 'Canastilla de 4–5 kg o bulto de 25 kg'],
            ['Tamaño', '200–350 g por unidad'],
            ['Duración', '15–20 días refrigerado'],
        ],
        image: '/productos/aguacate_comun.webp',
        altText: 'Fotografía de aguacate común criollo antillano de pulpa cremosa, calidad mercado nacional',
        specs: {
            nombreCientifico: 'Persea americana var. drymifolia',
            variedad: 'Criollo antillano regional',
            pesoPromedio: '200g - 350g por unidad',
            calibre: 'C - D (8-12 cm); 10-14 unidades por canastilla de 4 kg',
            empaque: 'Canastilla plástica de 4-5 kg o bulto de 25 kg',
            vidaUtil: '5-8 días ambiente; 15-20 días refrigerado a 5-7°C y 85-90% HR',
            contenidoAceite: '12% - 18%',
            rendimientoPulpa: '65% - 72%',
            origen: 'Tolima, Cundinamarca, Valle del Cauca, Antioquia, Eje Cafetero',
            certificacion: 'Resolución ICA 448/2016 (predio registrado), BPA'
        }
    },
    {
        id: 2,
        slug: 'aguacate-papelillo',
        name: 'Aguacate Papelillo',
        tagline: 'Cáscara delgada, pulpa amarilla',
        category: 'Frutas Frescas',
        description: 'Variedad de cáscara delgada y pulpa amarilla cremosa, raza guatemalteca-antillana. Alta demanda en mercados nacionales y supermercados.',
        // Precio estándar en COP por kilo (null = a convenir)
        price: 9000,
        facts: [
            ['Presentación', 'Canastilla de 5 kg o caja de 4 kg'],
            ['Tamaño', '350–700 g por unidad'],
            ['Duración', '18–25 días refrigerado'],
        ],
        image: '/productos/aguacate_papelillo.webp',
        altText: 'Fotografía de aguacate Papelillo de cáscara delgada y pulpa amarilla cremosa, calidad supermercado',
        specs: {
            nombreCientifico: 'Persea americana Mill.',
            variedad: 'Papelillo (Lorena en algunas zonas)',
            pesoPromedio: '350g - 700g por unidad',
            calibre: 'A - B (12-18 cm); 6-10 unidades por canastilla de 5 kg',
            empaque: 'Canastilla plástica 5 kg, caja cartón 4 kg retail, bulto 25 kg mayorista',
            vidaUtil: '7-10 días ambiente; 18-25 días refrigerado a 5-7°C y 90% HR',
            rendimientoPulpa: '70% - 78%',
            origen: 'Tolima (Mariquita, Fresno, Líbano), Quindío, Caldas, Risaralda, Valle',
            certificacion: 'Registro ICA, BPA, Global GAP (exportación)'
        }
    },
    {
        id: 3,
        slug: 'banano-comun',
        name: 'Banano Común',
        tagline: 'Dulce y de maduración uniforme',
        category: 'Retail y Supermercados',
        description: 'Banano Cavendish comercial, dulce y de maduración uniforme. Estándar para supermercados, plazas y exportación.',
        // Precio estándar en COP por kilo (null = a convenir)
        price: 2000,
        facts: [
            ['Presentación', 'Caja de 18,14 kg'],
            ['Tamaño', '120–180 g por dedo'],
            ['Duración', '21–28 días en verde'],
        ],
        image: '/productos/banano_comun.webp',
        altText: 'Fotografía de cluster de banano Cavendish maduro calidad exportación',
        specs: {
            nombreCientifico: 'Musa acuminata AAA',
            variedad: 'Cavendish (Williams, Valery, Gran Enano)',
            pesoPromedio: '120g - 180g por dedo; cluster 1.8-2.2 kg; racimo 25-35 kg',
            calibre: 'Grado 39-46 mm; longitud 18-22 cm (8-9 pulgadas)',
            empaque: 'Caja cartón corrugado 18.14 kg (40 lb) con polietileno',
            vidaUtil: 'Verde 21-28 días a 13-14°C y 85-95% HR; maduro 5-7 días ambiente',
            gradosBrix: '20-24 °Brix maduro',
            origen: 'Urabá Antioqueño, Magdalena (Zona Bananera), Santa Marta, La Guajira',
            certificacion: 'Global GAP, Rainforest Alliance, Fairtrade, ICA, BPA'
        }
    },
    {
        id: 4,
        slug: 'cerdos-en-canal',
        name: 'Cerdos en Canal',
        tagline: 'Canal fresca bajo normativa sanitaria',
        category: 'Cárnicos',
        description: 'Canal porcina fresca de cruces comerciales, faenada bajo normativa INVIMA. Trazabilidad completa desde granja certificada PorkColombia.',
        // Precio estándar en COP por kilo (null = a convenir)
        price: 11500,
        facts: [
            ['Presentación', 'Canal entera o media canal'],
            ['Tamaño', 'Canal de 75–92 kg'],
            ['Duración', '7–10 días refrigerado'],
        ],
        image: '/productos/cerdos_canal.webp',
        altText: 'Fotografía referencial de canal porcina fresca cruces comerciales bajo norma INVIMA',
        specs: {
            nombreCientifico: 'Sus scrofa domesticus',
            raza: 'Cruces Yorkshire x Landrace x Pietrain / Duroc',
            pesoPromedio: 'Canal caliente 78-92 kg; canal fría 75-88 kg',
            rendimientoCanal: '78% - 82%; espesor grasa dorsal 12-18 mm',
            porcentajeMagro: '58% - 62%',
            empaque: 'Canal entera o media en gancho; despiece al vacío grado alimenticio',
            vidaUtil: 'Refrigerado 7-10 días a 0-2°C; vacío 21-30 días a 0-4°C; congelado -18°C hasta 6 meses',
            phPostmortem: '5.6 - 6.2 (24h post-sacrificio)',
            origen: 'Antioquia (50% nacional), Valle del Cauca, Cundinamarca, Eje Cafetero, Meta',
            certificacion: 'INVIMA, ICA PorkColombia, Decreto 1500/2007, HACCP'
        }
    },
    {
        id: 8,
        slug: 'limon-tahiti',
        name: 'Limón Tahití',
        tagline: 'Jugoso y sin semilla',
        category: 'Frutas Frescas',
        description: 'Limón persa sin semilla, jugoso y aromático, calidad exportación. Producto estrella para gastronomía, retail e industria de bebidas.',
        // Precio estándar en COP por kilo (null = a convenir)
        price: null,
        facts: [
            ['Presentación', 'Caja de 4,5 kg o bulto de 25–40 kg'],
            ['Tamaño', '80–130 g por fruto'],
            ['Duración', '30–45 días refrigerado'],
        ],
        image: '/productos/limon_tahiti.webp',
        altText: 'Fotografía de limón Tahití persa sin semilla calidad exportación',
        specs: {
            nombreCientifico: 'Citrus latifolia Tanaka',
            variedad: 'Tahití (Persa)',
            pesoPromedio: '80g - 130g por fruto',
            calibre: '100/110/150/175/200/230/250 frutos por caja 4.5 kg; Ø 47-67 mm',
            empaque: 'Caja cartón 4.5 kg (10 lb) exportación; bulto 25-40 kg mercado nacional',
            vidaUtil: '14-21 días ambiente; 30-45 días refrigerado a 9-10°C y 85-90% HR',
            gradosBrix: '7-9 °Brix',
            acidez: '5.5% - 7% ácido cítrico',
            rendimientoJugo: '45% - 55%',
            origen: 'Tolima (Líbano, Mariquita), Santander, Antioquia, Meta, Valle, Casanare',
            certificacion: 'Global GAP, ICA Resolución 30021/2017 (HLB), USA/UE/UK'
        }
    },
    {
        id: 9,
        slug: 'platano-bolsa',
        name: 'Plátano Bolsa',
        tagline: 'Libre de manchas, calidad exportación',
        category: 'Industria Procesadora',
        description: 'Plátano dominico-hartón embolsado en campo con bolsa antitrips, libre de manchas y calibre uniforme. Calidad exportación.',
        // Precio estándar en COP por kilo (null = a convenir)
        price: 2400,
        facts: [
            ['Presentación', 'Canastilla de 20–22 kg o caja de 22,7 kg'],
            ['Tamaño', '280–450 g por dedo'],
            ['Duración', '18–25 días en verde'],
        ],
        image: '/productos/platano_bolsa.webp',
        altText: 'Fotografía de plátano dominico-hartón embolsado en campo libre de manchas, calidad exportación',
        specs: {
            nombreCientifico: 'Musa AAB Simmonds',
            variedad: 'Dominico Hartón embolsado en campo',
            pesoPromedio: 'Dedo 280-450 g; racimo 18-25 kg',
            calibre: 'Longitud 25-32 cm, Ø 50-60 mm; manos de 4-6 dedos',
            empaque: 'Caja cartón 22.7 kg (50 lb) exportación; canastilla 20-22 kg mayorista',
            vidaUtil: 'Verde 18-25 días a 13-14°C y 90% HR; ambiente 8-12 días',
            calidadCascara: 'Libre de manchas trips y sigatoka grado 1',
            origen: 'Quindío, Eje Cafetero (Caldas, Risaralda), Meta, Valle, Antioquia (Urabá)',
            certificacion: 'Global GAP, Rainforest Alliance, ICA exportador, BPA'
        }
    },
    {
        id: 11,
        slug: 'platano-guayabo',
        name: 'Plátano Guayabo',
        tagline: 'Dedos curvos y pulpa amarilla',
        category: 'Gastronomía',
        description: 'Variedad regional de dedos curvos delgados y pulpa amarilla. Apreciado en cocina tradicional para asar y cocinar maduro.',
        // Precio estándar en COP por kilo (null = a convenir)
        price: 2800,
        facts: [
            ['Presentación', 'Canastilla de 20–25 kg'],
            ['Tamaño', '150–220 g por dedo'],
            ['Duración', '15–20 días refrigerado'],
        ],
        image: '/productos/platano_guayabo.webp',
        altText: 'Fotografía de plátano Guayabo regional maduro de dedos curvos para cocina tradicional',
        specs: {
            nombreCientifico: 'Musa AAB',
            variedad: 'Guayabo (regional)',
            pesoPromedio: 'Dedo 150-220 g; racimo 10-15 kg',
            calibre: 'Longitud 18-24 cm, Ø 35-45 mm; manos de 8-12 dedos',
            empaque: 'Racimo entero o canastilla plástica 20-25 kg; bulto fibra 40-50 kg',
            vidaUtil: '7-10 días verde ambiente; 15-20 días refrigerado a 13-14°C y 90% HR',
            gradosBrix: '16-20 °Brix maduro',
            usos: 'Consumo fresco maduro, asado y cocido',
            origen: 'Tolima, Huila, Cundinamarca clima medio, Santander, Eje Cafetero',
            certificacion: 'BPA, registro ICA'
        }
    },
    {
        id: 12,
        slug: 'platano-guineo',
        name: 'Plátano Guineo',
        tagline: 'Pequeño, dulce y aromático',
        category: 'Gastronomía',
        description: 'Plátano bocadillo de dedo pequeño, alto contenido de azúcar y sabor intenso. Tradicional en repostería y consumo fresco.',
        // Precio estándar en COP por kilo (null = a convenir)
        price: 2400,
        facts: [
            ['Presentación', 'Canastilla de 18–20 kg'],
            ['Tamaño', '50–90 g por dedo'],
            ['Duración', '12–18 días refrigerado'],
        ],
        image: '/productos/platano_guineo.webp',
        altText: 'Fotografía de plátano Guineo bocadillo de dedo pequeño dulce para repostería tradicional',
        specs: {
            nombreCientifico: 'Musa AAB / ABB',
            variedad: 'Guineo bocadillo / manzano regional',
            pesoPromedio: 'Dedo 50-90 g; mano 0.8-1.2 kg; racimo 8-14 kg',
            calibre: 'Longitud 8-12 cm, Ø 25-32 mm; manos de 14-20 dedos',
            empaque: 'Canastilla plástica 18-20 kg; caja cartón 10-12 kg retail; racimo entero',
            vidaUtil: '5-8 días maduro ambiente; 12-18 días refrigerado a 13-14°C y 85-90% HR',
            gradosBrix: '22-26 °Brix maduro',
            usos: 'Consumo fresco, repostería, snacks',
            origen: 'Quindío, Risaralda, Caldas, Tolima, Valle, Cundinamarca clima medio',
            certificacion: 'BPA, ICA registro predio'
        }
    }
];

export const categories = [...new Set(catalog.map(p => p.category))];

export const findProduct = (slug) => catalog.find(p => p.slug === slug);

// Unidades en las que se puede cotizar (los precios son por kilo)
export const UNIT_TO_KG = { kg: 1, toneladas: 1000 };

export const formatQuantity = (value) =>
    new Intl.NumberFormat('es-CO', { maximumFractionDigits: 3 }).format(value);

export const formatCOP = (value) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
