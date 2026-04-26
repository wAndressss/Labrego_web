import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Briefcase, Upload, Send, CheckCircle, Calendar, Loader2 } from 'lucide-react';
import { vacancies } from '../data/vacancies';
import { useSeo } from '../hooks/useSeo';
import { useJsonLd } from '../hooks/useJsonLd';
import Breadcrumbs from '../components/Breadcrumbs';
import './Careers.css';

const SITE_URL = 'https://labrego.com';

function buildJobPosting(vacancy) {
    if (!vacancy) return null;

    // Job postings ideally have validThrough; default 60 days from postedDate
    const posted = new Date(vacancy.postedDate);
    const validThrough = new Date(posted);
    validThrough.setDate(validThrough.getDate() + 60);

    const employmentType = vacancy.type?.toLowerCase().includes('tiempo completo')
        ? 'FULL_TIME'
        : vacancy.type?.toLowerCase().includes('medio')
            ? 'PART_TIME'
            : 'OTHER';

    return {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: vacancy.title,
        description: `<p>${vacancy.description}</p>` +
            `<h3>Responsabilidades</h3><ul>${vacancy.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>` +
            `<h3>Requisitos</h3><ul>${vacancy.requirements.map(r => `<li>${r}</li>`).join('')}</ul>`,
        datePosted: vacancy.postedDate,
        validThrough: validThrough.toISOString().slice(0, 10),
        employmentType,
        industry: 'Agropecuaria',
        occupationalCategory: vacancy.area,
        identifier: {
            '@type': 'PropertyValue',
            name: 'Labrego',
            value: vacancy.id,
        },
        hiringOrganization: {
            '@type': 'Organization',
            name: 'Labrego S.A.S.',
            sameAs: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
        },
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: vacancy.location.split(',')[0]?.trim() || vacancy.location,
                addressRegion: 'Valle del Cauca',
                addressCountry: 'CO',
            },
        },
        url: `${SITE_URL}/trabaja-con-nosotros/${vacancy.id}`,
        directApply: true,
    };
}

function CareerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const vacancy = useMemo(() => vacancies.find(v => v.id === id), [id]);

    useSeo({
        title: vacancy ? `${vacancy.title} — Vacantes Labrego` : 'Vacante no encontrada — Labrego',
        description: vacancy ? `${vacancy.shortDescription} Ubicación: ${vacancy.location}. Postúlate en línea.` : 'La vacante solicitada no existe. Consulta otras vacantes abiertas en Labrego.',
        path: `/trabaja-con-nosotros/${id}`,
        type: vacancy ? 'article' : 'website',
    });

    const jobPostingLd = useMemo(() => buildJobPosting(vacancy), [vacancy]);
    useJsonLd(vacancy ? `jobposting-${vacancy.id}` : null, jobPostingLd);

    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', resume: null });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    if (!vacancy) {
        return (
            <div className="careers-page">
                <section className="page-header careers-header">
                    <div className="container">
                        <h1 className="page-title">Vacante no encontrada</h1>
                        <p className="page-subtitle">La vacante que buscas no existe o fue retirada.</p>
                    </div>
                </section>
                <section className="section">
                    <div className="container" style={{ textAlign: 'center' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/trabaja-con-nosotros')}>
                            Ver todas las vacantes
                        </button>
                    </div>
                </section>
            </div>
        );
    }

    const validate = () => {
        const e = {};
        if (!formData.name.trim()) e.name = 'Nombre requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Correo inválido';
        if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 7) e.phone = 'Teléfono inválido';
        if (!formData.resume) e.resume = 'Adjunta tu hoja de vida';
        return e;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (submitting) return;
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setSubmitError(null);
        setSubmitting(true);

        const payload = new FormData();
        payload.append('vacancyId', vacancy.id);
        payload.append('vacancyTitle', vacancy.title);
        payload.append('name', formData.name);
        payload.append('email', formData.email);
        payload.append('phone', formData.phone);
        payload.append('message', formData.message);
        payload.append('resume', formData.resume, formData.resume.name);

        try {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() < 0.02) reject(new Error('mock-network'));
                    else resolve();
                }, 1800);
            });
            // Mock multipart POST: in real backend -> fetch('/api/applications', { method: 'POST', body: payload })
            console.info('[mock] POST /api/applications', Object.fromEntries(payload.entries()));
            setSubmitted(true);
        } catch {
            setSubmitError('No pudimos enviar tu postulación. Inténtalo de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFile = (file) => {
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setErrors(e => ({ ...e, resume: 'Solo archivos PDF' }));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrors(e => ({ ...e, resume: 'Tamaño máximo 5MB' }));
            return;
        }
        setFormData({ ...formData, resume: file });
        setErrors(e => ({ ...e, resume: null }));
    };

    const handleDrop = (ev) => {
        ev.preventDefault();
        setDragOver(false);
        handleFile(ev.dataTransfer.files[0]);
    };

    if (submitted) {
        return (
            <div className="careers-page">
                <section className="page-header careers-header">
                    <div className="container">
                        <h1 className="page-title">Solicitud Recibida</h1>
                        <p className="page-subtitle">Gracias por postularte a Labrego.</p>
                    </div>
                </section>
                <section className="section">
                    <div className="container careers-success">
                        <CheckCircle size={56} />
                        <h2>¡Aplicación enviada con éxito!</h2>
                        <p>Recibimos tu postulación para <strong>{vacancy.title}</strong>. Revisaremos tu hoja de vida y nos pondremos en contacto contigo pronto.</p>
                        <div className="careers-success-actions">
                            <Link to="/trabaja-con-nosotros" className="btn btn-outline">Ver otras vacantes</Link>
                            <Link to="/" className="btn btn-primary">Volver al inicio</Link>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="careers-page">
            <section className="page-header careers-header">
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'Trabaja con Nosotros', to: '/trabaja-con-nosotros' },
                            { label: vacancy.title },
                        ]}
                    />
                    <Link to="/trabaja-con-nosotros" className="detail-back">
                        <ArrowLeft size={16} /> Ver todas las vacantes
                    </Link>
                    <h1 className="page-title">{vacancy.title}</h1>
                    <div className="detail-tags">
                        <span><Briefcase size={14} /> {vacancy.area}</span>
                        <span><MapPin size={14} /> {vacancy.location}</span>
                        <span><Clock size={14} /> {vacancy.type}</span>
                        <span><Calendar size={14} /> Publicado {new Date(vacancy.postedDate).toLocaleDateString('es-CO')}</span>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="detail-layout">
                        <div className="detail-content">
                            <h2 className="detail-heading">Sobre el cargo</h2>
                            <p className="detail-text">{vacancy.description}</p>

                            <h3 className="detail-subheading">Responsabilidades</h3>
                            <ul className="detail-list">
                                {vacancy.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>

                            <h3 className="detail-subheading">Requisitos</h3>
                            <ul className="detail-list">
                                {vacancy.requirements.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                        </div>

                        <aside className="detail-apply" id="apply">
                            <h2 className="detail-heading">Postúlate a esta vacante</h2>
                            <p className="detail-text detail-text-sm">Completa el formulario y adjunta tu hoja de vida en PDF.</p>
                            <form className="apply-form" onSubmit={handleSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="name">Nombre completo</label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Tu nombre"
                                        className={`form-control ${errors.name ? 'error' : ''}`}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    {errors.name && <span className="field-error">{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Correo electrónico</label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="tucorreo@ejemplo.com"
                                        className={`form-control ${errors.email ? 'error' : ''}`}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    {errors.email && <span className="field-error">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Teléfono</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="+57 300 000 0000"
                                        className={`form-control ${errors.phone ? 'error' : ''}`}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Mensaje (opcional)</label>
                                    <textarea
                                        id="message"
                                        rows="3"
                                        placeholder="Cuéntanos brevemente por qué te interesa esta vacante"
                                        className="form-control"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Hoja de vida (PDF)</label>
                                    <label
                                        className={`file-drop ${dragOver ? 'drag' : ''} ${errors.resume ? 'error' : ''}`}
                                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={handleDrop}
                                    >
                                        <Upload size={24} />
                                        {formData.resume ? (
                                            <span className="file-name">{formData.resume.name}</span>
                                        ) : (
                                            <>
                                                <span>Arrastra tu PDF o haz clic</span>
                                                <span className="file-hint">Máximo 5MB</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFile(e.target.files[0])}
                                        />
                                    </label>
                                    {errors.resume && <span className="field-error">{errors.resume}</span>}
                                </div>

                                {submitError && <div className="form-submit-error" role="alert">{submitError}</div>}

                                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                                    {submitting ? (
                                        <>Enviando... <Loader2 size={16} className="spin" /></>
                                    ) : (
                                        <>Enviar postulación <Send size={16} /></>
                                    )}
                                </button>
                            </form>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CareerDetail;
