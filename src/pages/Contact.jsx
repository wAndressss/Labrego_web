import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, MessageCircle, Clock } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import './Contact.css';

function Contact() {
    useSeo({
        title: 'Contacto — Labrego',
        description: 'Contáctanos para cotizaciones, alianzas comerciales o información sobre nuestros productos agropecuarios. Sede en Trujillo, Valle del Cauca, con operación regional en el centro y norte del Valle.',
        path: '/contacto',
    });

    const [data, setData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');

    const update = (k) => (e) => setData(d => ({ ...d, [k]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!data.name.trim()) e.name = 'Nombre requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Correo inválido';
        if (!data.phone.trim() || data.phone.replace(/\D/g, '').length < 7) e.phone = 'Teléfono inválido';
        if (!data.subject.trim()) e.subject = 'Asunto requerido';
        if (!data.message.trim() || data.message.trim().length < 10) e.message = 'Mensaje muy corto (mínimo 10 caracteres)';
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
        console.info('[mock] POST /api/contact', data);
        setStatus('success');
        setData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page">
            <section className="page-header contact-header">
                <div className="container">
                    <span className="hero-eyebrow">
                        <MessageCircle size={14} /> Hablemos
                    </span>
                    <h1 className="page-title">
                        Conversemos sobre <span className="gradient-text">tu próximo cultivo</span>
                    </h1>
                    <p className="page-subtitle">
                        Estamos listos para escucharte: cotizaciones, alianzas comerciales, exportación o servicio al cliente.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container contact-grid">
                    <aside className="contact-info">
                        <h2 className="contact-info-title">Información de contacto</h2>
                        <p className="contact-info-desc">
                            Escríbenos por el canal que prefieras. Te responderemos en menos de 24 horas hábiles.
                        </p>

                        <ul className="contact-list">
                            <li>
                                <span className="contact-icon"><MapPin size={18} /></span>
                                <div>
                                    <strong>Sede principal</strong>
                                    <span>Carrera 6 #5-42, Centro, Trujillo, Valle del Cauca, Colombia</span>
                                </div>
                            </li>
                            <li>
                                <span className="contact-icon"><MapPin size={18} /></span>
                                <div>
                                    <strong>Operación de campo</strong>
                                    <span>Centro y norte del Valle del Cauca — Trujillo, Riofrío, Bolívar, Roldanillo</span>
                                </div>
                            </li>
                            <li>
                                <span className="contact-icon"><Phone size={18} /></span>
                                <div>
                                    <strong>Teléfono principal</strong>
                                    <a href="tel:+5760226001234">+57 (602) 260 1234</a>
                                </div>
                            </li>
                            <li>
                                <span className="contact-icon"><Mail size={18} /></span>
                                <div>
                                    <strong>Servicio al cliente</strong>
                                    <a href="mailto:servicioalcliente@labrego.com">servicioalcliente@labrego.com</a>
                                </div>
                            </li>
                            <li>
                                <span className="contact-icon"><Mail size={18} /></span>
                                <div>
                                    <strong>Comercial / Cotizaciones</strong>
                                    <a href="mailto:comercial@labrego.com">comercial@labrego.com</a>
                                </div>
                            </li>
                            <li>
                                <span className="contact-icon"><Clock size={18} /></span>
                                <div>
                                    <strong>Horario de atención</strong>
                                    <span>Lunes a viernes 8:00–17:30 · Sábados 8:00–12:00</span>
                                </div>
                            </li>
                        </ul>
                    </aside>

                    <div className="contact-form-wrap">
                        {status === 'success' ? (
                            <div className="contact-success">
                                <CheckCircle size={56} />
                                <h2>¡Mensaje recibido!</h2>
                                <p>Gracias por escribirnos. Nuestro equipo te contactará pronto al correo o teléfono que nos compartiste.</p>
                                <button className="btn btn-outline" onClick={() => setStatus('idle')}>
                                    Enviar otro mensaje
                                </button>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit} noValidate>
                                <h2 className="contact-form-title">Envíanos un mensaje</h2>
                                <p className="contact-form-desc">Completa el formulario y nos pondremos en contacto contigo.</p>

                                <div className="contact-form-grid">
                                    <div className="form-group">
                                        <label htmlFor="c-name">Nombre completo *</label>
                                        <input id="c-name" type="text" className={`form-control ${errors.name ? 'error' : ''}`} value={data.name} onChange={update('name')} placeholder="Tu nombre" />
                                        {errors.name && <span className="field-error">{errors.name}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="c-email">Correo electrónico *</label>
                                        <input id="c-email" type="email" className={`form-control ${errors.email ? 'error' : ''}`} value={data.email} onChange={update('email')} placeholder="tucorreo@ejemplo.com" />
                                        {errors.email && <span className="field-error">{errors.email}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="c-phone">Teléfono *</label>
                                        <input id="c-phone" type="tel" className={`form-control ${errors.phone ? 'error' : ''}`} value={data.phone} onChange={update('phone')} placeholder="+57 300 000 0000" />
                                        {errors.phone && <span className="field-error">{errors.phone}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="c-subject">Asunto *</label>
                                        <select id="c-subject" className={`form-control ${errors.subject ? 'error' : ''}`} value={data.subject} onChange={update('subject')}>
                                            <option value="">Selecciona un asunto</option>
                                            <option value="cotizacion">Cotización de productos</option>
                                            <option value="alianza">Alianza comercial</option>
                                            <option value="exportacion">Exportación</option>
                                            <option value="proveedor">Proveedor / Productor</option>
                                            <option value="prensa">Prensa / Comunicaciones</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                        {errors.subject && <span className="field-error">{errors.subject}</span>}
                                    </div>
                                    <div className="form-group form-group-full">
                                        <label htmlFor="c-message">Mensaje *</label>
                                        <textarea id="c-message" rows="5" className={`form-control ${errors.message ? 'error' : ''}`} value={data.message} onChange={update('message')} placeholder="Cuéntanos cómo podemos ayudarte" />
                                        {errors.message && <span className="field-error">{errors.message}</span>}
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary btn-block" disabled={status === 'loading'}>
                                    {status === 'loading' ? (
                                        <>Enviando... <Loader2 size={16} className="spin" /></>
                                    ) : (
                                        <>Enviar mensaje <Send size={16} /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <section className="section bg-slate contact-map-section">
                <div className="container">
                    <h2 className="contact-map-title">Encuéntranos</h2>
                    <p className="contact-map-desc">Sede principal en el centro de Trujillo, Valle del Cauca. Operación de campo en el centro y norte del departamento.</p>
                    <div className="contact-map">
                        <iframe
                            title="Ubicación Labrego — Trujillo, Valle del Cauca"
                            src="https://www.google.com/maps?q=Trujillo,+Valle+del+Cauca,+Colombia&hl=es&z=13&output=embed"
                            width="100%"
                            height="420"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
