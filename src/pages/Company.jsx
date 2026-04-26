import { Target, Eye, Heart, Award, Users, Globe2, Sprout } from 'lucide-react';
import ClientTicker from '../components/home/ClientTicker';
import Counter from '../components/Counter';
import { useSeo } from '../hooks/useSeo';
import { useReveal } from '../hooks/useReveal';
import './Company.css';

const milestones = [
    { year: '2005', title: 'Fundación', text: 'Nace Labrego en Trujillo, en el corazón del Valle del Cauca.' },
    { year: '2012', title: 'Primer contrato corporativo', text: 'Iniciamos suministro a grandes supermercados nacionales.' },
    { year: '2018', title: 'Certificación Global GAP', text: 'Procesos estandarizados para exportación internacional.' },
    { year: '2023', title: 'Expansión orgánica', text: 'Línea de banano 100% orgánico dirigida a mercados europeos.' },
];

const achievements = [
    { icon: Award, value: 15, suffix: '+', label: 'Certificaciones internacionales' },
    { icon: Users, value: 250, suffix: '+', label: 'Colaboradores directos' },
    { icon: Globe2, value: 8, suffix: '', label: 'Países de exportación' },
    { icon: Sprout, value: 800, suffix: 'ha', label: 'Área cultivada sostenible' },
];

const valuesList = ['Integridad Empresarial', 'Calidad Innegociable', 'Sostenibilidad Ambiental', 'Innovación Continua'];

function Company() {
    useSeo({
        title: 'Quiénes Somos — Labrego',
        description: 'Conoce la historia, misión, visión y valores de Labrego: empresa agropecuaria colombiana referente en plátano y banano con más de 15 certificaciones internacionales.',
        path: '/empresa',
    });

    const [historyRef, historyVisible] = useReveal();
    const [achRef, achVisible] = useReveal();
    const [coreRef, coreVisible] = useReveal();
    const [tlRef, tlVisible] = useReveal(0.1);

    return (
        <div className="company-page">
            <section className="page-header">
                <div className="container">
                    <span className="hero-eyebrow">
                        <Sprout size={14} /> Sobre Labrego
                    </span>
                    <h1 className="page-title">
                        Sembramos <span className="gradient-text">historia</span> en el campo
                    </h1>
                    <p className="page-subtitle">Más de dos décadas dignificando el trabajo agrícola colombiano con tecnología, trazabilidad y compromiso ambiental.</p>
                </div>
            </section>

            <section className="section bg-white about-history" ref={historyRef}>
                <div className="container">
                    <div className={`history-grid ${historyVisible ? 'visible' : ''}`}>
                        <div className="history-text reveal-up">
                            <span className="section-eyebrow">Nuestra historia</span>
                            <h2 className="section-h">Del surco al mundo</h2>
                            <p>
                                Fundada hace más de dos décadas en Trujillo, en el corazón del Valle del Cauca, Labrego nació con la firme convicción de modernizar y dignificar el trabajo agrícola colombiano.
                            </p>
                            <p>
                                Crecimos desde una pequeña comercializadora local hasta convertirnos en un aliado estratégico para grandes corporaciones, aportando tecnología, procesos estandarizados y trazabilidad en cada racimo.
                            </p>
                        </div>
                        <div className="history-image-wrap reveal-up">
                            <div className="journey-frame company-frame">
                                <div className="journey-image" style={{ backgroundImage: 'url(/about_bg.png)' }} />
                                <span className="journey-badge">Trujillo, Valle del Cauca</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section achievements-section" ref={achRef}>
                <div className="container">
                    <div className={`achievements-grid ${achVisible ? 'visible' : ''}`}>
                        {achievements.map((a, i) => {
                            const Icon = a.icon;
                            return (
                                <div className="achievement-item reveal-up" key={a.label} style={{ transitionDelay: `${i * 90}ms` }}>
                                    <div className="achievement-icon"><Icon size={28} /></div>
                                    <div className="achievement-value">
                                        {achVisible ? <Counter to={a.value} suffix={a.suffix} /> : `0${a.suffix}`}
                                    </div>
                                    <div className="achievement-label">{a.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="section bg-slate" ref={coreRef}>
                <div className="container">
                    <div className={`section-header ${coreVisible ? 'visible' : ''} reveal-up`}>
                        <span className="section-eyebrow">Esencia Labrego</span>
                        <h2 className="section-h">Lo que cultivamos cada día</h2>
                    </div>
                    <div className={`core-values-grid ${coreVisible ? 'visible' : ''}`}>
                        <div className="core-card reveal-up" style={{ transitionDelay: '0ms' }}>
                            <div className="core-icon"><Target size={32} /></div>
                            <h3>Misión</h3>
                            <p>Proveer productos del campo con la más alta calidad mediante procesos sostenibles y tecnológicos, asegurando satisfacción de clientes corporativos y bienestar de comunidades.</p>
                        </div>
                        <div className="core-card reveal-up" style={{ transitionDelay: '120ms' }}>
                            <div className="core-icon"><Eye size={32} /></div>
                            <h3>Visión</h3>
                            <p>Ser empresa líder en producción y comercialización de productos agropecuarios en la región, reconocida por solidez, innovación y compromiso ambiental.</p>
                        </div>
                        <div className="core-card reveal-up" style={{ transitionDelay: '240ms' }}>
                            <div className="core-icon"><Heart size={32} /></div>
                            <h3>Valores</h3>
                            <ul className="values-list">
                                {valuesList.map(v => <li key={v}>{v}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section bg-white" ref={tlRef}>
                <div className="container">
                    <div className={`section-header ${tlVisible ? 'visible' : ''} reveal-up`}>
                        <span className="section-eyebrow">Recorrido</span>
                        <h2 className="section-h">Hitos del camino</h2>
                    </div>
                    <div className={`timeline ${tlVisible ? 'visible' : ''}`}>
                        {milestones.map((m, idx) => (
                            <div className={`timeline-item reveal-up ${idx % 2 === 0 ? 'left' : 'right'}`} key={m.year} style={{ transitionDelay: `${idx * 120}ms` }}>
                                <div className="timeline-marker"><span>{m.year}</span></div>
                                <div className="timeline-card">
                                    <h4>{m.title}</h4>
                                    <p>{m.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <ClientTicker />
        </div>
    );
}

export default Company;
