import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Truck,
    LineChart,
    Leaf,
    Building2,
    PackageCheck,
    ClipboardList,
    Package,
    MessageCircle,
    MapPin,
} from 'lucide-react';
import ProductShowcase from '../components/ProductShowcase';
import { catalog } from '../data/products';
import ClientTicker from '../components/home/ClientTicker';
import Counter from '../components/Counter';
import { useSeo } from '../hooks/useSeo';
import { useReveal } from '../hooks/useReveal';
import { useParallax } from '../hooks/useParallax';
import { useScrollProgress } from '../hooks/useScrollProgress';
import './Home.css';

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

const quoteSteps = [
    { icon: Package, title: 'Elige productos', text: 'Selecciona del catálogo y define cantidades por kilo, caja o canastilla.' },
    { icon: Truck, title: 'Define la entrega', text: 'Frecuencia, ciudad y fecha de la primera entrega.' },
    { icon: MessageCircle, title: 'Recibe tu propuesta', text: 'Te respondemos por WhatsApp o correo en menos de 24 h hábiles.' },
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
            'Proveedor mayorista de plátano, banano, aguacate, limón y cárnicos para supermercados, agroindustria y foodservice en Colombia.',
        path: '/',
    });

    const [heroRef, heroVisible] = useReveal(0.05);
    const [expRef, expVisible] = useReveal(0.18);
    const [productsRef, productsVisible] = useReveal(0.12);
    const [benefitsRef, benefitsVisible] = useReveal(0.15);
    const [statsRef, statsVisible] = useReveal(0.2);
    const [quoteRef, quoteVisible] = useReveal(0.2);

    const heroBgRef = useParallax(0.22, { scale: 0.0004 });
    const cineImgRef = useParallax(0.15, { scale: 0.0006 });
    const [cineRef, cineProgress] = useScrollProgress();

    const navigate = useNavigate();
    const [showcaseIndex, setShowcaseIndex] = useState(0);

    return (
        <div className="lab-home">
            {/* HERO with bg image */}
            <section className="lab-hero" ref={heroRef} aria-label="Bienvenida">
                <div className="lab-hero-img" ref={heroBgRef} aria-hidden="true" />
                <div className="lab-hero-overlay" aria-hidden="true" />
                <div className="lab-hero-particles" aria-hidden="true">
                    {Array.from({ length: 14 }).map((_, i) => <span key={i} />)}
                </div>

                <div className="container lab-hero-inner">
                    <div className="lab-hero-copy">
                        <span className={`lab-pill ${heroVisible ? 'visible' : ''}`}>
                            <Sparkles size={14} strokeWidth={2} />
                            Cosecha 2026 · Proveedor B2B
                        </span>

                        <h1 className={`lab-hero-h reveal-up ${heroVisible ? 'visible' : ''}`}>
                            Alimentos frescos del campo{' '}
                            <span className="lab-accent">en volumen real.</span>
                        </h1>

                        <p className={`lab-hero-script script-text reveal-up ${heroVisible ? 'visible' : ''}`}>
                            Cultivamos calidad. Cosechamos confianza.
                        </p>

                        <p className={`lab-hero-lead reveal-up ${heroVisible ? 'visible' : ''}`}>
                            Producimos y abastecemos plátano, banano, aguacate, limón y cárnicos
                            para retail, plazas, mayoristas e industria.
                        </p>

                        <ul className={`lab-hero-checks reveal-up ${heroVisible ? 'visible' : ''}`}>
                            <li><ShieldCheck size={16} /> Trazabilidad por lote</li>
                            <li><Truck size={16} /> Entregas programadas</li>
                            <li><LineChart size={16} /> Volumen constante</li>
                        </ul>

                        <div className={`lab-hero-actions reveal-up ${heroVisible ? 'visible' : ''}`}>
                            <Link to="/cotizar" className="lab-btn lab-btn-accent">
                                Cotizar pedido
                                <ClipboardList size={16} />
                            </Link>
                            <Link to="/productos" className="lab-btn lab-btn-outline-light">
                                Ver productos
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Collage de fotos con etiquetas flotantes */}
                    <div className={`lab-hero-visual ${heroVisible ? 'visible' : ''}`} aria-hidden="true">
                        <div className="lab-hero-photo lab-hero-photo-main" />
                        <div className="lab-hero-photo lab-hero-photo-small" />
                        <div className="lab-hero-tag lab-hero-tag-1">
                            <span><MapPin size={16} /></span>
                            <div><strong>Valle del Cauca</strong><small>Trujillo · Colombia</small></div>
                        </div>
                        <div className="lab-hero-tag lab-hero-tag-2">
                            <div className="lab-hero-faces">
                                {catalog.slice(0, 4).map(p => <img key={p.slug} src={p.image} alt="" />)}
                            </div>
                            <div><strong>{catalog.length} productos</strong><small>del campo a tu empresa</small></div>
                        </div>
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
                                {statsVisible ? <Counter to={8} /> : '0'}
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

            {/* PRODUCTS — carrusel */}
            <section className="lab-products leaf-pattern" ref={productsRef} aria-label="Nuestros productos">
                <div className="container">
                    <header className={`lab-section-head lab-section-head-center reveal-up ${productsVisible ? 'visible' : ''}`}>
                        <span className="lab-eyebrow">Catálogo</span>
                        <h2 className="lab-h2">
                            Productos que ya están en{' '}
                            <span className="lab-accent">tu próximo pedido</span>.
                        </h2>
                    </header>

                    <ProductShowcase
                        products={catalog}
                        index={showcaseIndex}
                        onIndexChange={setShowcaseIndex}
                        onDetails={(p) => navigate(`/productos?producto=${p.slug}`)}
                    />

                    <div className="lab-products-foot">
                        <Link to="/productos" className="lab-btn lab-btn-outline">
                            Ver catálogo completo
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* COTIZACIÓN — llamado a la acción */}
            <section className="lab-quote-cta" ref={quoteRef} aria-label="Cotiza tu pedido">
                <div className="lab-quote-cta-bg" aria-hidden="true" />
                <div className="container">
                    <div className="lab-quote-cta-inner">
                        <header className={`lab-quote-cta-head reveal-up ${quoteVisible ? 'visible' : ''}`}>
                            <span className="lab-eyebrow lab-eyebrow-light">Cotización en línea</span>
                            <h2 className="lab-h2">
                                Tu pedido cotizado{' '}
                                <span className="lab-accent">en 3 pasos.</span>
                            </h2>
                            <p className="lab-section-lead">
                                Sin llamadas ni formularios eternos. Arma tu lista, dinos dónde
                                entregar y recibe precios por volumen.
                            </p>
                            <Link to="/cotizar" className="lab-btn lab-btn-accent">
                                Empezar cotización
                                <ArrowRight size={16} />
                            </Link>
                        </header>

                        <ol className={`lab-quote-steps reveal-stagger ${quoteVisible ? 'visible' : ''}`}>
                            {quoteSteps.map((q, i) => {
                                const Icon = q.icon;
                                return (
                                    <li key={q.title} className="lab-quote-step">
                                        <span className="lab-quote-step-num">0{i + 1}</span>
                                        <span className="lab-quote-step-icon"><Icon size={22} strokeWidth={1.6} /></span>
                                        <div>
                                            <h3>{q.title}</h3>
                                            <p>{q.text}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </div>
            </section>

            <ClientTicker />

        </div>
    );
}

export default Home;
