import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, X, Download, MessageSquare, Search, Sprout, FileText, ClipboardList } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { useReveal } from '../hooks/useReveal';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductImage from '../components/ProductImage';
import { catalog } from '../data/products';
import './Products.css';


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
    const navigate = useNavigate();
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

    const openQuote = (product) => navigate(`/cotizar?producto=${product.slug}`);

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
                    <p className="page-subtitle">Plátanos, banano, aguacate, limón y cárnicos con trazabilidad y calidad de exportación.</p>
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
                                        <ProductImage
                                            src={product.image}
                                            alt={product.altText}
                                            name={product.name}
                                            className="catalog-img"
                                        />
                                        <div className="catalog-category">{product.category}</div>
                                    </div>
                                    <div className="catalog-content">
                                        <h3 className="catalog-name">{product.name}</h3>
                                        <p className="catalog-desc">{product.description}</p>
                                        <div className="catalog-card-actions">
                                            <button onClick={() => openModal(product)} className="btn btn-outline">
                                                <FileText size={16} /> Ficha
                                            </button>
                                            <Link to={`/cotizar?producto=${product.slug}`} className="btn btn-primary">
                                                Cotizar <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="catalog-quote-band">
                        <span className="catalog-quote-icon" aria-hidden="true">
                            <ClipboardList size={26} strokeWidth={1.6} />
                        </span>
                        <div>
                            <h2>¿Necesitas varios productos?</h2>
                            <p>Arma una sola cotización con todo tu pedido: cantidades, frecuencia y destino.</p>
                        </div>
                        <Link to="/cotizar" className="btn btn-primary">
                            Cotizar pedido <ArrowRight size={18} />
                        </Link>
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
                            aria-label="Cerrar modal"
                        >
                            <X size={22} />
                        </button>

                        <div className="modal-body">
                            <div className="modal-image-col">
                                <ProductImage
                                    src={selectedProduct.image}
                                    alt={selectedProduct.altText}
                                    name={selectedProduct.name}
                                    loading="eager"
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

        </div>
    );
}

export default Products;
