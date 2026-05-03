import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    ArrowUpRight,
    Sparkles,
    ShieldCheck,
    Truck,
    LineChart,
    Leaf,
    Building2,
    PackageCheck,
    X,
    FileText,
} from 'lucide-react';
import ClientTicker from '../components/home/ClientTicker';
import Counter from '../components/Counter';
import { useSeo } from '../hooks/useSeo';
import { useReveal } from '../hooks/useReveal';
import { useParallax } from '../hooks/useParallax';
import { useScrollProgress } from '../hooks/useScrollProgress';
import './Home.css';

const products = [
    {
        name: 'Plátano Verde',
        img: '/productos/platano_verde.png',
        tag: 'Industria',
        meta: 'Musa AAB · Quindío',
        desc: 'Calibrado y empacado para agroindustria. Volumen estable durante todo el año.',
        specs: {
            'Variedad': 'Dominico-Hartón (Musa AAB)',
            'Origen': 'Quindío, Colombia',
            'Calibre': '20 – 26 cm · Grado 38 – 46 mm',
            'Empaque': 'Caja cartón 22 kg · 18 kg',
            'Conservación': '12 – 14 °C · HR 90 %',
            'Vida útil': '21 – 28 días',
            'Disponibilidad': 'Todo el año',
            'Certificaciones': 'GLOBAL G.A.P. · BPA',
        },
    },
    {
        name: 'Banano Común',
        img: '/productos/banano_comun.png',
        tag: 'Retail',
        meta: 'Cavendish · AAA',
        desc: 'Madurez controlada para góndola. Logística en frío sin interrupción.',
        specs: {
            'Variedad': 'Cavendish (Musa AAA)',
            'Origen': 'Urabá / Magdalena, Colombia',
            'Calibre': 'Grado 39 – 46 mm',
            'Empaque': 'Caja 18.14 kg · 13 kg',
            'Conservación': '13 – 14 °C · HR 85 %',
            'Vida útil': '28 – 35 días',
            'Disponibilidad': 'Todo el año',
            'Certificaciones': 'GLOBAL G.A.P. · Rainforest',
        },
    },
    {
        name: 'Aguacate Papelillo',
        img: '/productos/aguacate_papelillo.png',
        tag: 'Premium',
        meta: 'Persea americana',
        desc: 'Pulpa cremosa, cáscara delgada. Selección por calibre para retail premium.',
        specs: {
            'Variedad': 'Papelillo · Persea americana',
            'Origen': 'Eje cafetero, Colombia',
            'Calibre': '180 – 320 g por unidad',
            'Empaque': 'Caja 4 kg · 10 kg',
            'Conservación': '5 – 7 °C · HR 90 %',
            'Vida útil': '14 – 21 días',
            'Disponibilidad': 'Marzo – Septiembre',
            'Certificaciones': 'GLOBAL G.A.P.',
        },
    },
];

const benefits = [
    {
        icon: ShieldCheck,
        title: 'Trazabilidad total',
        text: 'Cada lote viene con su historia. Desde la finca hasta tu centro de distribución.',
    },
    {
        icon: Truck,
        title: 'Logística sin fricción',
        text: 'Cadena de frío continua y entregas programadas. Tu reposición, sin sobresaltos.',
    },
    {
        icon: LineChart,
        title: 'Volumen predecible',
        text: 'Planeación agronómica anual para mantener oferta estable durante toda la temporada.',
    },
    {
        icon: Leaf,
        title: 'Origen responsable',
        text: 'Manejo agronómico que respeta suelo, agua y comunidades productoras.',
    },
];

const channels = [
    { icon: Building2, label: 'Supermercados', text: 'Seguridad en calidad, volumen y tiempos de entrega.' },
    { icon: PackageCheck, label: 'Agroindustria', text: 'Volumen y calibre a la medida.' },
    { icon: Truck, label: 'Foodservice', text: 'Frescura puntual.' },
];

function Home() {
    useSeo({
        title: 'Labrego — Productos Agropecuarios de Colombia',
        description:
            'Proveedor mayorista de plátano, banano, aguacate, frutas, hortalizas y cárnicos para supermercados, agroindustria y foodservice en Colombia.',
        path: '/',
    });

    const [heroRef, heroVisible] = useReveal(0.05);
    const [expRef, expVisible] = useReveal(0.18);
    const [productsRef, productsVisible] = useReveal(0.12);
    const [benefitsRef, benefitsVisible] = useReveal(0.15);
    const [statsRef, statsVisible] = useReveal(0.2);

    const heroBgRef = useParallax(0.22, { scale: 0.0004 });
    const cineImgRef = useParallax(0.15, { scale: 0.0006 });
    const [cineRef, cineProgress] = useScrollProgress();

    const [openSpec, setOpenSpec] = useState(null);

    useEffect(() => {
        if (!openSpec) return;
        const onKey = (e) => { if (e.key === 'Escape') setOpenSpec(null); };
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKey);
        };
    }, [openSpec]);

    return (
        <div className="lab-home">
            {/* HERO with bg image */}
            <section className="lab-hero" ref={heroRef} aria-label="Bienvenida">
                <div className="lab-hero-img" ref={heroBgRef} aria-hidden="true" />
                <div className="lab-hero-overlay" aria-hidden="true" />

                <div className="container lab-hero-inner">
                    <span className={`lab-pill ${heroVisible ? 'visible' : ''}`}>
                        <Sparkles size={14} strokeWidth={2} />
                        Cosecha 2026 · Proveedor B2B
                    </span>

                    <h1 className={`lab-hero-h reveal-up ${heroVisible ? 'visible' : ''}`}>
                        Abastecimiento de{' '}
                        <span className="lab-accent">alimentos frescos en volumen real.</span>
                    </h1>

                    <p className={`lab-hero-lead reveal-up ${heroVisible ? 'visible' : ''}`}>
                        Producimos y abastecemos frutas y cárnicos
                        para retail, plazas, mayoristas e industria.
                        <br />• Volumen constante  • Trazabilidad documentada  • Logística precisa<br />
                    </p>

                    <div className={`lab-hero-actions reveal-up ${heroVisible ? 'visible' : ''}`}>
                        <Link to="/productos" className="lab-btn lab-btn-olive">
                            Ver Productos
                            <ArrowRight size={16} />
                        </Link>
                        <a
                            href="https://www.proveedores.labrego.com.co"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lab-btn lab-btn-outline-light"
                        >
                            Acceso Portal
                            <ArrowUpRight size={16} />
                        </a>
                    </div>
                </div>

                <div className="lab-hero-scroll-cue" aria-hidden="true">
                    <span />
                </div>
            </section>

            {/* STATS — proof inmediato */}
            <section className="lab-stats" ref={statsRef} aria-label="Cifras">
                <div className="container">
                    <div className={`lab-stats-grid reveal-stagger ${statsVisible ? 'visible' : ''}`}>
                        <div className="lab-stat">
                            <span className="lab-stat-num">
                                {statsVisible ? <Counter to={5} suffix="+" /> : '0+'}
                            </span>
                            <span className="lab-stat-lbl">Años en el mercado</span>
                        </div>
                        <div className="lab-stat">
                            <span className="lab-stat-num">
                                {statsVisible ? <Counter to={10} suffix="+" /> : '0+'}
                            </span>
                            <span className="lab-stat-lbl">Hectáreas activas</span>
                        </div>
                        <div className="lab-stat">
                            <span className="lab-stat-num">
                                {statsVisible ? <Counter to={13} /> : '0'}
                            </span>
                            <span className="lab-stat-lbl">Productos del agro</span>
                        </div>
                        <div className="lab-stat">
                            <span className="lab-stat-num">
                                {statsVisible ? <Counter to={50} suffix="+" /> : '0+'}
                            </span>
                            <span className="lab-stat-lbl">Aliados comerciales</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* EXPERIENCE — bananas + badge */}
            <section className="lab-exp" ref={expRef} aria-label="Experiencia">
                <div className="container lab-exp-grid">
                    <div className={`lab-exp-img-wrap reveal-up ${expVisible ? 'visible' : ''}`}>
                        <div className="lab-exp-img" />
                        <div className="lab-exp-badge" aria-hidden="true">
                            <span className="lab-exp-badge-num">+5</span>
                            <span className="lab-exp-badge-lbl">AÑOS DE EXPERIENCIA</span>
                        </div>
                    </div>
                    <div className={`lab-exp-text reveal-up ${expVisible ? 'visible' : ''}`}>
                        <span className="lab-eyebrow">Nuestra esencia</span>
                        <h2 className="lab-h2">
                            Pasión por el campo,{' '}
                            <span className="lab-accent">excelencia en cada producto.</span>
                        </h2>
                        <p className="lab-section-lead">
                            Sembramos con técnica, cosechamos con criterio y entregamos con
                            disciplina. Cada caja de fruta lleva el oficio de generaciones
                            de productores colombianos.
                        </p>
                        <div className="lab-exp-pills">
                            <span><Leaf size={14} /> Manejo agronómico responsable</span>
                            <span><ShieldCheck size={14} /> Trazabilidad de lote</span>
                            <span><Truck size={14} /> Responsabilidad en tiempos de entrega</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* MARQUEE — cinta llamativa */}
            <section className="lab-marquee" aria-hidden="true">
                <div className="lab-marquee-track">
                    {Array.from({ length: 4 }).map((_, g) => (
                        <div className="lab-marquee-group" key={g}>
                            <span>Cosecha responsable</span><span className="lab-marquee-dot">✦</span>
                            <span>Entregas puntuales</span><span className="lab-marquee-dot">✦</span>
                            <span>Trazabilidad total</span><span className="lab-marquee-dot">✦</span>
                            <span>Volumen predecible</span><span className="lab-marquee-dot">✦</span>
                            <span>Calidad</span><span className="lab-marquee-dot">✦</span>
                            <span>Origen Colombiano</span><span className="lab-marquee-dot">✦</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* B2B — beneficios + canales */}
            <section className="lab-b2b" ref={benefitsRef} aria-label="Trabajar con nosotros">
                <div className="container lab-b2b-grid">
                    <header className={`lab-b2b-head reveal-up ${benefitsVisible ? 'visible' : ''}`}>
                        <span className="lab-eyebrow">Para empresas</span>
                        <h2 className="lab-h2">
                            Tu reposición no debería ser{' '}
                            <span className="lab-accent">una sorpresa cada semana</span>.
                        </h2>
                        <p className="lab-section-lead">
                            Diseñamos acuerdos de suministro estables, con precios
                            predecibles y volumen contractual. Tu mesa de compras nos
                            agradecerá.
                        </p>

                        <div className="lab-channels">
                            {channels.map((c) => {
                                const Icon = c.icon;
                                return (
                                    <div key={c.label} className="lab-channel">
                                        <Icon size={18} strokeWidth={1.6} />
                                        <div>
                                            <strong>{c.label}</strong>
                                            <span>{c.text}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </header>

                    <div className={`lab-benefits reveal-stagger ${benefitsVisible ? 'visible' : ''}`}>
                        {benefits.map((b) => {
                            const Icon = b.icon;
                            return (
                                <article key={b.title} className="lab-benefit-card">
                                    <span className="lab-benefit-icon">
                                        <Icon size={20} strokeWidth={1.6} />
                                    </span>
                                    <h3 className="lab-benefit-title">{b.title}</h3>
                                    <p className="lab-benefit-text">{b.text}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CINEMATIC — animación scroll entre B2B y Catálogo */}
            <section
                className="lab-cine"
                ref={cineRef}
                style={{ '--cine-p': cineProgress }}
                aria-label="Del campo a tu mesa"
            >
                <div className="lab-cine-img" ref={cineImgRef} aria-hidden="true" />
                <div className="lab-cine-overlay" aria-hidden="true" />

                <div className="lab-cine-leaves" aria-hidden="true">
                    <Leaf className="lab-cine-leaf lab-cine-leaf-1" size={28} strokeWidth={1.4} />
                    <Leaf className="lab-cine-leaf lab-cine-leaf-2" size={36} strokeWidth={1.4} />
                    <Leaf className="lab-cine-leaf lab-cine-leaf-3" size={22} strokeWidth={1.4} />
                    <Leaf className="lab-cine-leaf lab-cine-leaf-4" size={32} strokeWidth={1.4} />
                </div>

                <div className="container lab-cine-content">
                    <span className="lab-cine-eyebrow">Trazabilidad de lote a mesa</span>
                    <h2 className="lab-cine-h">
                        Del campo,{' '}
                        <span className="lab-cine-accent">directo a tu empresa.</span>
                    </h2>
                    <div className="lab-cine-rail" aria-hidden="true">
                        <span className="lab-cine-rail-fill" />
                    </div>
                    <div className="lab-cine-stops">
                        <span><strong>01</strong> Cosecha</span>
                        <span><strong>02</strong> Selección</span>
                        <span><strong>03</strong> Empaque</span>
                        <span><strong>04</strong> Distribución</span>
                    </div>
                </div>
            </section>

            {/* PRODUCTS — catálogo teaser */}
            <section className="lab-products" ref={productsRef} aria-label="Catálogo destacado">
                <div className="container">
                    <header className={`lab-section-head lab-section-head-center reveal-up ${productsVisible ? 'visible' : ''}`}>
                        <span className="lab-eyebrow">Catálogo</span>
                        <h2 className="lab-h2">
                            Productos que ya están en{' '}
                            <span className="lab-accent">tu próximo pedido</span>.
                        </h2>
                        <p className="lab-section-lead">
                            Selección curada para volumen mayorista. Calidad consistente,
                            calibres definidos y disponibilidad anual.
                        </p>
                    </header>

                    <div className={`lab-products-grid reveal-stagger ${productsVisible ? 'visible' : ''}`}>
                        {products.map((p) => (
                            <article key={p.name} className="lab-product-card">
                                <div className="lab-product-img">
                                    <img src={p.img} alt={p.name} loading="lazy" />
                                    <span className="lab-product-tag">{p.tag}</span>
                                </div>
                                <div className="lab-product-body">
                                    <span className="lab-product-meta">{p.meta}</span>
                                    <h3 className="lab-product-name">{p.name}</h3>
                                    <p className="lab-product-desc">{p.desc}</p>
                                    <button
                                        type="button"
                                        className="lab-btn lab-btn-card"
                                        onClick={() => setOpenSpec(p)}
                                    >
                                        <FileText size={14} />
                                        Ver Ficha Técnica
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="lab-products-foot">
                        <Link to="/productos" className="lab-btn lab-btn-outline">
                            Ver catálogo completo
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            <ClientTicker />

            {/* SPEC MODAL */}
            {openSpec && (
                <div
                    className="lab-modal-backdrop"
                    onClick={() => setOpenSpec(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Ficha técnica ${openSpec.name}`}
                >
                    <div className="lab-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="lab-modal-close"
                            onClick={() => setOpenSpec(null)}
                            aria-label="Cerrar"
                        >
                            <X size={18} />
                        </button>
                        <div className="lab-modal-head">
                            <div className="lab-modal-img">
                                <img src={openSpec.img} alt={openSpec.name} />
                            </div>
                            <div>
                                <span className="lab-modal-tag">{openSpec.tag}</span>
                                <h3 className="lab-modal-title">{openSpec.name}</h3>
                                <p className="lab-modal-desc">{openSpec.desc}</p>
                            </div>
                        </div>
                        <table className="lab-modal-table">
                            <tbody>
                                {Object.entries(openSpec.specs).map(([k, v]) => (
                                    <tr key={k}>
                                        <th scope="row">{k}</th>
                                        <td>{v}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="lab-modal-actions">
                            <Link to="/contacto" className="lab-btn lab-btn-olive" onClick={() => setOpenSpec(null)}>
                                Solicitar cotización
                                <ArrowRight size={16} />
                            </Link>
                            <button type="button" className="lab-btn lab-btn-outline" onClick={() => setOpenSpec(null)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
