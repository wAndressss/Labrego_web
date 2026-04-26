import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, X, Download, MessageSquare, Search, Sprout, Send, CheckCircle, Loader2 } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { useReveal } from '../hooks/useReveal';
import Breadcrumbs from '../components/Breadcrumbs';
import './Products.css';

const catalog = [
    {
        id: 1,
        name: 'Aguacate Común',
        category: 'Frutas Frescas',
        description: 'Aguacate criollo antillano de pulpa cremosa y sabor tradicional. Ideal para consumo fresco y mercados mayoristas en plaza.',
        image: '/productos/aguacate_comun.png',
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
        name: 'Aguacate Papelillo',
        category: 'Frutas Frescas',
        description: 'Variedad de cáscara delgada y pulpa amarilla cremosa, raza guatemalteca-antillana. Alta demanda en mercados nacionales y supermercados.',
        image: '/productos/aguacate_papelillo.png',
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
        name: 'Banano Común',
        category: 'Retail y Supermercados',
        description: 'Banano Cavendish comercial, dulce y de maduración uniforme. Estándar para supermercados, plazas y exportación.',
        image: '/productos/banano_comun.png',
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
        name: 'Cerdos en Canal',
        category: 'Cárnicos',
        description: 'Canal porcina fresca de cruces comerciales, faenada bajo normativa INVIMA. Trazabilidad completa desde granja certificada PorkColombia.',
        image: '/productos/cerdos_canal.png',
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
        id: 5,
        name: 'Granadilla',
        category: 'Frutas Frescas',
        description: 'Pulpa gelatinosa, dulce y aromática, calidad exportación a UE y Estados Unidos. Una de las pasifloras estrella de Colombia.',
        image: '/productos/granadilla.png',
        altText: 'Fotografía de granadilla colombiana entera y partida mostrando pulpa gelatinosa dulce',
        specs: {
            nombreCientifico: 'Passiflora ligularis Juss.',
            variedad: 'Granadilla común (ecotipos Urrao, Huila, Valle)',
            pesoPromedio: '80g - 150g por fruto',
            calibre: 'A (>120g, 7-8 cm Ø), B (90-120g), C (70-90g); 30-40 frutos por caja 4.5 kg',
            empaque: 'Caja cartón 4-4.5 kg con malla individual; canastilla 8-10 kg mercado nacional',
            vidaUtil: '8-12 días ambiente; 21-28 días refrigerado a 7-10°C y 85-90% HR',
            gradosBrix: '13-18 °Brix',
            acidez: '0.9% - 1.4% ácido cítrico',
            origen: 'Huila, Cundinamarca, Boyacá, Antioquia (Urrao), Valle, Tolima, Nariño',
            certificacion: 'Global GAP, ICA predio exportador, admisibilidad UE/USA'
        }
    },
    {
        id: 6,
        name: 'Guayaba Manzana',
        category: 'Frutas Frescas',
        description: 'Guayaba regional de Vélez (Santander), pulpa blanca-rosada firme y sabor balanceado. Excelente para consumo fresco y bocadillo.',
        image: '/productos/guayaba_manzana.png',
        altText: 'Fotografía de guayaba manzana variedad Vélez de pulpa blanca-rosada firme',
        specs: {
            nombreCientifico: 'Psidium guajava L.',
            variedad: 'Manzana (regional Vélez-Santander)',
            pesoPromedio: '120g - 200g por fruto',
            calibre: 'Diámetro 6-8 cm; 25-35 frutos por canastilla de 5 kg',
            empaque: 'Canastilla plástica 5-10 kg; caja cartón 4 kg retail',
            vidaUtil: '4-6 días ambiente; 10-15 días refrigerado a 8-10°C y 85-90% HR',
            gradosBrix: '8-11 °Brix',
            vitaminaC: '150-220 mg/100 g',
            origen: 'Santander (Vélez, Barbosa, Puente Nacional), Boyacá, Tolima, Meta, Valle',
            certificacion: 'BPA ICA, registro predio'
        }
    },
    {
        id: 7,
        name: 'Guayaba Pera',
        category: 'Frutas Frescas',
        description: 'Forma piriforme y pulpa rosada-roja, dulce y aromática. Excelente rendimiento para jugos, pulpas y postres.',
        image: '/productos/guayaba_pera.png',
        altText: 'Fotografía de guayaba pera piriforme con pulpa rosada-roja para jugos y pulpas',
        specs: {
            nombreCientifico: 'Psidium guajava L.',
            variedad: 'Pera (piriforme, pulpa rosada)',
            pesoPromedio: '150g - 250g por fruto',
            calibre: 'Ø 6-9 cm, longitud 8-11 cm; 20-30 frutos por canastilla de 5 kg',
            empaque: 'Canastilla plástica calada 5-10 kg; caja cartón 3-4 kg supermercado',
            vidaUtil: '5-7 días ambiente; 12-18 días refrigerado a 8-10°C y 90% HR',
            gradosBrix: '10-13 °Brix',
            rendimientoPulpa: '75% - 85%',
            origen: 'Santander (Hoya del Río Suárez), Boyacá, Tolima, Meta, Valle, Atlántico',
            certificacion: 'BPA, ICA, Global GAP exportación incipiente'
        }
    },
    {
        id: 8,
        name: 'Limón Tahití',
        category: 'Frutas Frescas',
        description: 'Limón persa sin semilla, jugoso y aromático, calidad exportación. Producto estrella para gastronomía, retail e industria de bebidas.',
        image: '/productos/limon_tahiti.png',
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
        name: 'Plátano Bolsa',
        category: 'Industria Procesadora',
        description: 'Plátano dominico-hartón embolsado en campo con bolsa antitrips, libre de manchas y calibre uniforme. Calidad exportación.',
        image: '/productos/platano_verde.png',
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
        id: 10,
        name: 'Plátano Verde',
        category: 'Industria Procesadora',
        description: 'Plátano dominico-hartón verde, bajo contenido de humedad y alto en almidón. Ideal para snacks, frituras y agroindustria.',
        image: '/productos/platano_verde.png',
        altText: 'Fotografía de plátano dominico-hartón verde alto en almidón para snacks y frituras industriales',
        specs: {
            nombreCientifico: 'Musa AAB Simmonds',
            variedad: 'Dominico Hartón',
            pesoPromedio: 'Dedo 250-400 g; racimo 12-22 kg',
            calibre: 'Longitud 22-30 cm, Ø 45-55 mm; manos de 5-7 dedos',
            empaque: 'Bulto fibra 50-60 kg; canastilla plástica 22-25 kg; racimo entero',
            vidaUtil: '8-14 días ambiente verde; 21-28 días refrigerado a 13-14°C y 85-90% HR',
            almidonVerde: '70% - 75% base seca',
            humedad: '60% - 65%',
            origen: 'Quindío, Caldas, Risaralda, Tolima, Meta, Antioquia, Córdoba',
            certificacion: 'BPA, ICA registro predio, Global GAP exportación'
        }
    },
    {
        id: 11,
        name: 'Plátano Guayabo',
        category: 'Gastronomía',
        description: 'Variedad regional de dedos curvos delgados y pulpa amarilla. Apreciado en cocina tradicional para asar y cocinar maduro.',
        image: '/productos/prod_maduro.png',
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
        name: 'Plátano Guineo',
        category: 'Gastronomía',
        description: 'Plátano bocadillo de dedo pequeño, alto contenido de azúcar y sabor intenso. Tradicional en repostería y consumo fresco.',
        image: '/productos/prod_cavendish.png',
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
    },
    {
        id: 13,
        name: 'Tomate de Cocina',
        category: 'Hortalizas',
        description: 'Tomate chonto larga vida de pulpa firme, ideal para cocción, salsas y consumo fresco. Híbridos comerciales para mercado nacional.',
        image: '/productos/tomate_cocina.png',
        altText: 'Fotografía de tomate chonto larga vida de pulpa firme para cocción y salsas',
        specs: {
            nombreCientifico: 'Solanum lycopersicum L.',
            variedad: 'Chonto larga vida: Sofía, Santa Cruz, Río Grande, Libertador',
            pesoPromedio: '120g - 220g por fruto',
            calibre: 'Primera (>180g, Ø 70-85 mm), Segunda (140-180g), Tercera (90-140g)',
            empaque: 'Canastilla plástica calada 18-22 kg (estándar Corabastos); caja cartón 10 kg retail',
            vidaUtil: 'Pintón 10-14 días ambiente; maduro 5-7 días; refrigerado 14-21 días a 10-12°C y 85-90% HR',
            gradosBrix: '4.5 - 6 °Brix',
            firmeza: '3 - 5 kgf/cm²',
            origen: 'Norte de Santander (Ocaña), Antioquia Oriente, Boyacá, Sabana de Bogotá, Valle, Nariño',
            certificacion: 'BPA Resolución ICA 30021, Global GAP cultivos protegidos'
        }
    }
];

const categoryNames = ['Todos', ...new Set(catalog.map(p => p.category))];

const categoryCounts = categoryNames.reduce((acc, name) => {
    acc[name] = name === 'Todos' ? catalog.length : catalog.filter(p => p.category === name).length;
    return acc;
}, {});

const formatLabel = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());

function Products() {
    useSeo({
        title: 'Productos — Labrego',
        description: 'Catálogo corporativo de plátano y banano Labrego: calidad exportación, trazabilidad completa y empaques industriales. Descubre nuestras variedades.',
        path: '/productos',
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quoteProduct, setQuoteProduct] = useState(null);
    const [filter, setFilter] = useState('Todos');
    const [search, setSearch] = useState('');
    const modalRef = useRef(null);
    const closeBtnRef = useRef(null);

    const filtered = catalog.filter(p =>
        (filter === 'Todos' || p.category === filter) &&
        (p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    );

    const openModal = (product) => setSelectedProduct(product);
    const closeModal = () => setSelectedProduct(null);

    useEffect(() => {
        const anyOpen = selectedProduct || quoteProduct;
        if (!anyOpen) {
            document.body.style.overflow = '';
            return;
        }
        document.body.style.overflow = 'hidden';
        const handleKey = (e) => {
            if (e.key !== 'Escape') return;
            if (quoteProduct) setQuoteProduct(null);
            else if (selectedProduct) setSelectedProduct(null);
        };
        window.addEventListener('keydown', handleKey);
        if (selectedProduct && !quoteProduct) closeBtnRef.current?.focus();
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [selectedProduct, quoteProduct]);

    const openQuote = (product) => setQuoteProduct(product);

    const handleDatasheet = (product) => {
        const rows = Object.entries(product.specs)
            .map(([k, v]) => `<tr><th>${formatLabel(k)}</th><td>${v}</td></tr>`)
            .join('');
        const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Ficha Técnica — ${product.name}</title>
<style>
body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1a2e0a;max-width:800px;margin:2rem auto;padding:0 1.5rem;line-height:1.5;}
header{border-bottom:3px solid #98ba30;padding-bottom:1rem;margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:flex-end;}
h1{margin:0;font-size:1.8rem;}
.brand{color:#98ba30;font-weight:700;letter-spacing:2px;}
.cat{display:inline-block;background:#f3f7e6;color:#4a6b14;padding:.25rem .75rem;border-radius:99px;font-size:.8rem;margin-bottom:.5rem;}
table{width:100%;border-collapse:collapse;margin-top:1rem;}
th,td{text-align:left;padding:.65rem .5rem;border-bottom:1px dashed #d9e0c8;font-size:.92rem;vertical-align:top;}
th{width:200px;color:#1a2e0a;font-weight:600;}
td{color:#4a5340;}
.actions{margin:1.5rem 0;}
button{background:#98ba30;color:#fff;border:none;padding:.6rem 1.25rem;border-radius:99px;cursor:pointer;font-weight:600;}
footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #eee;font-size:.8rem;color:#888;}
@media print{.actions{display:none;}}
</style></head>
<body>
<header><div><div class="cat">${product.category}</div><h1>${product.name}</h1><p style="margin:.25rem 0;color:#4a5340;">${product.description}</p></div><span class="brand">LABREGO</span></header>
<div class="actions"><button onclick="window.print()">Imprimir / Guardar PDF</button></div>
<h2 style="font-size:1.1rem;color:#4a6b14;">Especificaciones técnicas</h2>
<table>${rows}</table>
<footer>Documento generado automáticamente — Labrego S.A.S. · contacto@labrego.com</footer>
</body></html>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        if (!win) {
            // Popup blocked: fallback to navigation
            window.location.href = url;
        }
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
    };

    const [gridRef, gridVisible] = useReveal(0.05);

    return (
        <div className="catalog-page">
            <section className="page-header products-header">
                <div className="container">
                    <span className="hero-eyebrow">
                        <Sprout size={14} /> Cosecha del campo
                    </span>
                    <h1 className="page-title">
                        Productos del <span className="gradient-text">campo Labrego</span>
                    </h1>
                    <p className="page-subtitle">Frutas, hortalizas, plátanos, banano y cárnicos con trazabilidad y calidad de exportación.</p>
                </div>
            </section>

            <section className="section bg-slate pb-5">
                <div className="container">
                    <div className="catalog-toolbar">
                        <div className="catalog-search">
                            <Search size={18} />
                            <input
                                type="search"
                                placeholder="Buscar producto..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                aria-label="Buscar producto"
                            />
                        </div>
                        <div className="catalog-filters" role="tablist">
                            {categoryNames.map(c => (
                                <button
                                    key={c}
                                    className={`filter-chip ${filter === c ? 'active' : ''}`}
                                    onClick={() => setFilter(c)}
                                    role="tab"
                                    aria-selected={filter === c}
                                >
                                    {c} <span className="chip-count">({categoryCounts[c]})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="catalog-empty">
                            <p>No se encontraron productos con los filtros seleccionados.</p>
                            <button className="btn btn-outline" onClick={() => { setFilter('Todos'); setSearch(''); }}>
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        <div className={`catalog-grid ${gridVisible ? 'visible' : ''}`} ref={gridRef}>
                            {filtered.map((product, i) => (
                                <article key={product.id} className="card catalog-card reveal-up" style={{ transitionDelay: `${Math.min(i, 8) * 60}ms` }}>
                                    <div className="catalog-img-wrap">
                                        <img
                                            src={product.image}
                                            alt={product.altText || product.name}
                                            className="catalog-img"
                                            loading="lazy"
                                            onError={(e) => { e.currentTarget.src = '/about_bg.png'; }}
                                        />
                                        <div className="catalog-category">{product.category}</div>
                                    </div>
                                    <div className="catalog-content">
                                        <h3 className="catalog-name">{product.name}</h3>
                                        <p className="catalog-desc">{product.description}</p>
                                        <button onClick={() => openModal(product)} className="btn btn-outline btn-block mt-auto">
                                            Ver Ficha Técnica <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {selectedProduct && (
                <div
                    className="modal-overlay"
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div className="modal-content" ref={modalRef} onClick={e => e.stopPropagation()}>
                        <button
                            ref={closeBtnRef}
                            className="modal-close"
                            onClick={closeModal}
                            aria-label="Cerrar modal"
                        >
                            <X size={22} />
                        </button>

                        <div className="modal-body">
                            <div className="modal-image-col">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.altText || selectedProduct.name}
                                    onError={(e) => { e.currentTarget.src = '/about_bg.png'; }}
                                />
                            </div>
                            <div className="modal-info-col">
                                <Breadcrumbs
                                    className="dark"
                                    items={[
                                        { label: 'Productos', to: '/productos' },
                                        { label: selectedProduct.category, to: '/productos' },
                                        { label: selectedProduct.name },
                                    ]}
                                />
                                <span className="modal-badge">{selectedProduct.category}</span>
                                <h2 id="modal-title">{selectedProduct.name}</h2>
                                <p className="modal-desc">{selectedProduct.description}</p>

                                <h4 className="specs-title">Especificaciones Técnicas</h4>
                                <ul className="specs-list">
                                    {Object.entries(selectedProduct.specs).map(([key, value]) => (
                                        <li key={key}>
                                            <strong>{formatLabel(key)}</strong>
                                            <span>{value}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => openQuote(selectedProduct)}
                                    >
                                        <MessageSquare size={18} /> Solicitar Cotización
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => handleDatasheet(selectedProduct)}
                                    >
                                        <Download size={18} /> Ficha Técnica
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {quoteProduct && (
                <QuoteModal
                    product={quoteProduct}
                    onClose={() => setQuoteProduct(null)}
                />
            )}
        </div>
    );
}

function QuoteModal({ product, onClose }) {
    const [data, setData] = useState({ name: '', company: '', phone: '', quantity: '', message: '' });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');
    const closeRef = useRef(null);

    useEffect(() => { closeRef.current?.focus(); }, []);

    const update = (k) => (e) => setData(d => ({ ...d, [k]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!data.name.trim()) e.name = 'Nombre requerido';
        if (!data.phone.trim() || data.phone.replace(/\D/g, '').length < 7) e.phone = 'Teléfono inválido';
        if (!data.quantity.trim()) e.quantity = 'Cantidad requerida';
        return e;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (status === 'loading') return;
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setStatus('loading');
        await new Promise(r => setTimeout(r, 1500));
        console.info('[mock] POST /api/quotes', { productId: product.id, productName: product.name, ...data });
        setStatus('success');
    };

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
        >
            <div className="modal-content quote-modal" onClick={e => e.stopPropagation()}>
                <button
                    ref={closeRef}
                    className="modal-close"
                    onClick={onClose}
                    aria-label="Cerrar cotización"
                >
                    <X size={22} />
                </button>

                {status === 'success' ? (
                    <div className="quote-success">
                        <CheckCircle size={56} />
                        <h2>Solicitud enviada</h2>
                        <p>
                            Recibimos tu cotización para <strong>{product.name}</strong>. Nuestro equipo comercial te contactará en menos de 24 horas hábiles.
                        </p>
                        <button className="btn btn-primary" onClick={onClose}>Entendido</button>
                    </div>
                ) : (
                    <div className="quote-body">
                        <span className="modal-badge">Cotización</span>
                        <h2 id="quote-title">Solicitar cotización — {product.name}</h2>
                        <p className="modal-desc">Completa tus datos y te enviaremos una propuesta comercial personalizada.</p>

                        <form className="quote-form" onSubmit={handleSubmit} noValidate>
                            <div className="form-group">
                                <label htmlFor="q-name">Nombre completo *</label>
                                <input id="q-name" type="text" className={`form-control ${errors.name ? 'error' : ''}`} value={data.name} onChange={update('name')} placeholder="Tu nombre" />
                                {errors.name && <span className="field-error">{errors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="q-company">Empresa</label>
                                <input id="q-company" type="text" className="form-control" value={data.company} onChange={update('company')} placeholder="Razón social (opcional)" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="q-phone">Teléfono *</label>
                                <input id="q-phone" type="tel" className={`form-control ${errors.phone ? 'error' : ''}`} value={data.phone} onChange={update('phone')} placeholder="+57 300 000 0000" />
                                {errors.phone && <span className="field-error">{errors.phone}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="q-qty">Cantidad estimada *</label>
                                <input id="q-qty" type="text" className={`form-control ${errors.quantity ? 'error' : ''}`} value={data.quantity} onChange={update('quantity')} placeholder="ej. 500 cajas / 2 toneladas / mensual" />
                                {errors.quantity && <span className="field-error">{errors.quantity}</span>}
                            </div>
                            <div className="form-group form-group-full">
                                <label htmlFor="q-message">Mensaje</label>
                                <textarea id="q-message" rows="3" className="form-control" value={data.message} onChange={update('message')} placeholder="Cuéntanos sobre destino, frecuencia, calidad esperada, etc." />
                            </div>

                            <div className="quote-actions">
                                <button type="button" className="btn btn-outline" onClick={onClose} disabled={status === 'loading'}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                                    {status === 'loading' ? (
                                        <>Enviando... <Loader2 size={16} className="spin" /></>
                                    ) : (
                                        <>Enviar solicitud <Send size={16} /></>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Products;
