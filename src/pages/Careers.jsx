import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, Heart, Rocket, Search, ArrowRight, Sprout } from 'lucide-react';
import { vacancies, areas, locations } from '../data/vacancies';
import { useSeo } from '../hooks/useSeo';
import { useReveal } from '../hooks/useReveal';
import './Careers.css';

const perks = [
    { icon: Briefcase, title: 'Crecimiento profesional', text: 'Planes de carrera claros y formación continua.' },
    { icon: Heart, title: 'Bienestar integral', text: 'Cultura de respeto, salud ocupacional y vida balanceada.' },
    { icon: Rocket, title: 'Innovación diaria', text: 'Proyectos tecnológicos aplicados al campo.' },
];

function Careers() {
    useSeo({
        title: 'Trabaja con Nosotros — Labrego',
        description: 'Únete al equipo de Labrego. Descubre nuestras vacantes abiertas en campo, operaciones, ventas, tecnología y administración. Postúlate en línea.',
        path: '/trabaja-con-nosotros',
    });
    const [search, setSearch] = useState('');
    const [area, setArea] = useState('Todas');
    const [loc, setLoc] = useState('Todas');

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return vacancies.filter(v => {
            if (area !== 'Todas' && v.area !== area) return false;
            if (loc !== 'Todas' && v.location !== loc) return false;
            if (q && !(
                v.title.toLowerCase().includes(q) ||
                v.shortDescription.toLowerCase().includes(q) ||
                v.area.toLowerCase().includes(q)
            )) return false;
            return true;
        });
    }, [search, area, loc]);

    const [perksRef, perksVisible] = useReveal();
    const [vacRef, vacVisible] = useReveal(0.1);

    return (
        <div className="careers-page">
            <section className="page-header careers-header">
                <div className="container">
                    <span className="hero-eyebrow">
                        <Sprout size={14} /> Únete al campo
                    </span>
                    <h1 className="page-title">
                        Construye el <span className="gradient-text">futuro del agro</span>
                    </h1>
                    <p className="page-subtitle">Únete a un equipo que transforma el campo colombiano con tecnología, sostenibilidad y propósito.</p>
                </div>
            </section>

            <section className="section perks-section" ref={perksRef}>
                <div className="container">
                    <div className={`perks-grid ${perksVisible ? 'visible' : ''}`}>
                        {perks.map((p, i) => {
                            const Icon = p.icon;
                            return (
                                <div className="perk-card reveal-up" key={p.title} style={{ transitionDelay: `${i * 100}ms` }}>
                                    <div className="perk-icon"><Icon size={24} /></div>
                                    <h3>{p.title}</h3>
                                    <p>{p.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="section bg-slate" ref={vacRef}>
                <div className="container">
                    <div className={`vacancies-header reveal-up ${vacVisible ? 'visible' : ''}`}>
                        <span className="section-eyebrow">Oportunidades</span>
                        <h2 className="section-h">Vacantes abiertas</h2>
                        <p className="vacancies-count">{filtered.length} {filtered.length === 1 ? 'vacante' : 'vacantes'} disponibles</p>
                    </div>

                    <div className="vacancies-toolbar">
                        <div className="vacancies-search">
                            <Search size={18} />
                            <input
                                type="search"
                                placeholder="Buscar por cargo o área..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                aria-label="Buscar vacantes"
                            />
                        </div>
                        <select
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            aria-label="Filtrar por área"
                            className="vacancies-select"
                        >
                            {areas.map(a => <option key={a} value={a}>{a === 'Todas' ? 'Todas las áreas' : a}</option>)}
                        </select>
                        <select
                            value={loc}
                            onChange={(e) => setLoc(e.target.value)}
                            aria-label="Filtrar por ubicación"
                            className="vacancies-select"
                        >
                            {locations.map(l => <option key={l} value={l}>{l === 'Todas' ? 'Todas las ubicaciones' : l}</option>)}
                        </select>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="vacancies-empty">
                            <p>No encontramos vacantes con esos criterios. Prueba ajustar los filtros.</p>
                        </div>
                    ) : (
                        <ul className={`vacancies-list ${vacVisible ? 'visible' : ''}`}>
                            {filtered.map((v, i) => (
                                <li key={v.id} className="vacancy-card reveal-up" style={{ transitionDelay: `${i * 60}ms` }}>
                                    <div className="vacancy-card-body">
                                        <div className="vacancy-meta">
                                            <span className="vacancy-area">{v.area}</span>
                                        </div>
                                        <h3 className="vacancy-title">{v.title}</h3>
                                        <p className="vacancy-desc">{v.shortDescription}</p>
                                        <div className="vacancy-info">
                                            <span><MapPin size={14} /> {v.location}</span>
                                            <span><Clock size={14} /> {v.type}</span>
                                        </div>
                                    </div>
                                    <Link to={`/trabaja-con-nosotros/${v.id}`} className="btn btn-primary vacancy-cta">
                                        Ver y postular <ArrowRight size={16} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Careers;
