import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Download, Sprout, ShieldCheck, Award, Truck, Package, Ruler, Clock } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { useReveal } from '../hooks/useReveal';
import ProductImage from '../components/ProductImage';
import ProductShowcase from '../components/ProductShowcase';
import { catalog } from '../data/products';
import './Products.css';

// Íconos para los tres datos clave de la ficha: presentación, tamaño y duración
const FACT_ICONS = [Package, Ruler, Clock];

const trustPoints = [
    { icon: ShieldCheck, title: 'Trazabilidad por lote', text: 'Cada despacho identifica finca, fecha de cosecha y lote.' },
    { icon: Award, title: 'Calidad exportación', text: 'Selección por calibre y buenas prácticas agrícolas certificadas.' },
    { icon: Truck, title: 'Entregas programadas', text: 'Volumen estable y logística coordinada con tu operación.' },
];

const formatLabel = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());

function Products() {
    useSeo({
        title: 'Productos — Labrego',
        description: 'Catálogo corporativo de plátano y banano Labrego: calidad exportación, trazabilidad completa y empaques industriales. Descubre nuestras variedades.',
        path: '/productos',
    });
    const [searchParams] = useSearchParams();
    // ?producto=slug (desde el inicio) abre el carrusel en ese producto
    const [index, setIndex] = useState(() => Math.max(0, catalog.findIndex(p => p.slug === searchParams.get('producto'))));
    const [selectedProduct, setSelectedProduct] = useState(null);
    const modalRef = useRef(null);
    const closeBtnRef = useRef(null);

    const openModal = (product) => setSelectedProduct(product);
    const closeModal = () => setSelectedProduct(null);

    useEffect(() => {
        if (!selectedProduct) {
            document.body.style.overflow = '';
            return;
        }
        document.body.style.overflow = 'hidden';
        const handleKey = (e) => {
            if (e.key === 'Escape') setSelectedProduct(null);
        };
        window.addEventListener('keydown', handleKey);
        closeBtnRef.current?.focus();
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [selectedProduct]);

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
<footer>Documento generado automáticamente — Labrego S.A.S. · labregooficial@gmail.com</footer>
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

    const [trustRef, trustVisible] = useReveal(0.2);

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
                    <p className="page-subtitle">Plátanos, banano, aguacate, limón y cárnicos con trazabilidad y calidad de exportación.</p>
                </div>
            </section>

            <section className="catalog-section leaf-pattern">
                <div className="container">
                    <div className="catalog-intro">
                        <span className="catalog-eyebrow">Nuestros productos</span>
                        <h2 className="catalog-title">Del campo colombiano a tu operación</h2>
                        <p className="catalog-lead script-text">Cultivamos calidad. Cosechamos confianza.</p>
                    </div>

                    <ProductShowcase
                        products={catalog}
                        index={index}
                        onIndexChange={setIndex}
                        onDetails={openModal}
                        showThumbs
                    />

                    <div className={`catalog-trust reveal-stagger ${trustVisible ? 'visible' : ''}`} ref={trustRef}>
                        {trustPoints.map(t => {
                            const Icon = t.icon;
                            return (
                                <div key={t.title} className="catalog-trust-item">
                                    <span className="catalog-trust-icon"><Icon size={22} strokeWidth={1.6} /></span>
                                    <div>
                                        <strong>{t.title}</strong>
                                        <span>{t.text}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
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
                            aria-label="Cerrar ficha técnica"
                        >
                            <X size={20} />
                        </button>

                        <div className="modal-body">
                            <div className="modal-image-col">
                                <span className="catalog-halo" aria-hidden="true" />
                                <ProductImage
                                    src={selectedProduct.image}
                                    alt={selectedProduct.altText}
                                    name={selectedProduct.name}
                                    loading="eager"
                                />
                            </div>
                            <div className="modal-info-col">
                                <span className="modal-badge">{selectedProduct.category}</span>
                                <h2 id="modal-title">{selectedProduct.name}</h2>
                                <p className="modal-tagline script-text">{selectedProduct.tagline}</p>
                                <p className="modal-desc">{selectedProduct.description}</p>

                                <div className="modal-highlights">
                                    {selectedProduct.facts.map(([label, value], i) => {
                                        const Icon = FACT_ICONS[i];
                                        return (
                                            <div key={label} className="modal-highlight">
                                                <Icon size={18} strokeWidth={1.7} />
                                                <span>{label}</span>
                                                <strong>{value}</strong>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => handleDatasheet(selectedProduct)}
                                    >
                                        <Download size={18} /> Ficha técnica completa
                                    </button>
                                    <button type="button" className="btn btn-outline" onClick={closeModal}>
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;
