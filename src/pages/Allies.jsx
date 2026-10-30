import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Handshake, ShieldCheck, Truck, LineChart, Store, Factory, Building2 } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { useReveal } from '../hooks/useReveal';
import { allies, ALLY_SECTORS } from '../data/allies';
import './Allies.css';

const SECTOR_ICONS = {
    Supermercados: Store,
    'Industria de alimentos': Factory,
};

const reasons = [
    { icon: ShieldCheck, title: 'Calidad constante', text: 'Producto seleccionado por calibre y con trazabilidad por lote.' },
    { icon: Truck, title: 'Entregas cumplidas', text: 'Despachos programados según la operación de cada aliado.' },
    { icon: LineChart, title: 'Volumen estable', text: 'Planeación de cosecha para abastecer todo el año.' },
];

function Allies() {
    useSeo({
        title: 'Aliados comerciales — Labrego',
        description: 'Supermercados e industria de alimentos que confían en Labrego para su abastecimiento de plátano, banano, aguacate, limón y cárnicos.',
        path: '/aliados',
    });

    const [sector, setSector] = useState('Todos');
    const [gridRef, gridVisible] = useReveal(0.1);
    const [whyRef, whyVisible] = useReveal(0.2);
    const visible = sector === 'Todos' ? allies : allies.filter(a => a.sector === sector);
    const count = (s) => (s === 'Todos' ? allies.length : allies.filter(a => a.sector === s).length);

    return (
        <div className="allies-page">
            <section className="page-header allies-header">
                <div className="container">
                    <span className="hero-eyebrow"><Handshake size={14} /> Aliados comerciales</span>
                    <h1 className="page-title">
                        Empresas que <span className="gradient-text">crecen con nosotros</span>
                    </h1>
                    <p className="page-subtitle">
                        Supermercados e industria de alimentos que confían en Labrego para llevar productos del campo a sus clientes.
                    </p>
                </div>
            </section>

            <section className="allies-section leaf-pattern">
                <div className="container">
                    <div className="allies-filters" role="tablist" aria-label="Sectores">
                        {['Todos', ...ALLY_SECTORS].map(s => (
                            <button
                                key={s}
                                type="button"
                                role="tab"
                                aria-selected={sector === s}
                                className={`allies-chip ${sector === s ? 'active' : ''}`}
                                onClick={() => setSector(s)}
                            >
                                {s} <span>{count(s)}</span>
                            </button>
                        ))}
                    </div>

                    <div className={`allies-grid reveal-stagger ${gridVisible ? 'visible' : ''}`} ref={gridRef} key={sector}>
                        {visible.map(ally => {
                            const Icon = SECTOR_ICONS[ally.sector] || Building2;
                            return (
                                <article key={ally.name} className="ally-card">
                                    <div className="ally-logo">
                                        <img src={ally.logo} alt={`Logo de ${ally.name}`} loading="lazy" />
                                    </div>
                                    <div className="ally-info">
                                        <h2>{ally.name}</h2>
                                        <span><Icon size={14} /> {ally.sector}</span>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <p className="allies-count">
                        <strong>{allies.length}</strong> aliados destacados · más de <strong>50</strong> clientes en Colombia
                    </p>
                </div>
            </section>

            <section className="allies-why" ref={whyRef}>
                <div className="container">
                    <header className="allies-why-head">
                        <span className="allies-eyebrow">Por qué nos eligen</span>
                        <h2>Una relación de largo plazo, <span>no un pedido suelto</span>.</h2>
                    </header>
                    <div className={`allies-reasons reveal-stagger ${whyVisible ? 'visible' : ''}`}>
                        {reasons.map(r => {
                            const Icon = r.icon;
                            return (
                                <div key={r.title} className="allies-reason">
                                    <span><Icon size={22} strokeWidth={1.7} /></span>
                                    <h3>{r.title}</h3>
                                    <p>{r.text}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="allies-cta">
                        <div>
                            <h2>¿Quieres ser nuestro aliado?</h2>
                            <p className="script-text">Cultivamos calidad. Cosechamos confianza.</p>
                        </div>
                        <div className="allies-cta-actions">
                            <Link to="/cotizar" className="btn btn-primary">
                                Cotizar pedido <ArrowRight size={18} />
                            </Link>
                            <Link to="/contacto" className="btn btn-outline allies-cta-outline">
                                Hablar con ventas
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Allies;
