import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Send, CheckCircle, MessageCircle, Clock, ArrowUpRight, Sprout, ClipboardList, Copy, Check, Sun, Sunset } from 'lucide-react';
import { GmailIcon, WhatsAppIcon } from '../components/icons/BrandIcons';
import { useSeo } from '../hooks/useSeo';
import { useReveal } from '../hooks/useReveal';
import {
    EMAIL,
    OFFICE_DAYS,
    OFFICE_HOURS_TEXT,
    OFFICE_SHIFTS,
    WHATSAPP_DISPLAY,
    WHATSAPP_PHONE,
} from '../data/contact';
import './Contact.css';

const SUBJECTS = [
    'Información de productos',
    'Alianza comercial',
    'Exportación',
    'Proveedor / Productor',
    'Servicio al cliente',
    'Otro',
];

const WEEK = ['D', 'L', 'M', 'M', 'J', 'V', 'S']; // 0 = domingo
const WEEK_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const formatHour = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = String(minutes % 60).padStart(2, '0');
    if (h === 12 && m === '00') return '12:00 m.';
    return `${h > 12 ? h - 12 : h}:${m} ${h < 12 ? 'a.m.' : 'p.m.'}`;
};

// Día y minuto actuales en hora de Colombia
function bogotaNow(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Bogota',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23',
    }).formatToParts(date);
    const get = (type) => parts.find(p => p.type === type)?.value;
    return {
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')),
        minutes: Number(get('hour')) * 60 + Number(get('minute')),
    };
}

// Estado del horario: jornada en curso o cuándo volvemos a abrir
function officeStatus(now = bogotaNow()) {
    const workday = OFFICE_DAYS.includes(now.day);
    const current = workday ? OFFICE_SHIFTS.findIndex(s => now.minutes >= s.from && now.minutes < s.to) : -1;
    if (current >= 0) {
        return { open: true, current, day: now.day, text: `Abierto · hasta las ${formatHour(OFFICE_SHIFTS[current].to)}` };
    }
    const laterToday = workday && OFFICE_SHIFTS.find(s => now.minutes < s.from);
    if (laterToday) {
        return { open: false, current: -1, day: now.day, text: `Cerrado · abrimos hoy a las ${formatHour(laterToday.from)}` };
    }
    let next = (now.day + 1) % 7;
    while (!OFFICE_DAYS.includes(next)) next = (next + 1) % 7;
    const when = next === (now.day + 1) % 7 ? 'mañana' : `el ${WEEK_NAMES[next]}`;
    return { open: false, current: -1, day: now.day, text: `Cerrado · abrimos ${when} a las ${formatHour(OFFICE_SHIFTS[0].from)}` };
}

function useOfficeStatus() {
    const [status, setStatus] = useState(() => officeStatus());
    useEffect(() => {
        const id = setInterval(() => setStatus(officeStatus()), 60_000);
        return () => clearInterval(id);
    }, []);
    return status;
}

// Botón que copia un texto y confirma por un momento
function CopyButton({ value, label }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            /* sin permiso de portapapeles: no hacemos nada */
        }
    };
    return (
        <button type="button" className={`contact-copy ${copied ? 'copied' : ''}`} onClick={copy} aria-label={`Copiar ${label}`}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copiado' : 'Copiar'}
        </button>
    );
}

const emptyForm = { name: '', email: '', phone: '', subject: '', message: '' };

function Contact() {
    useSeo({
        title: 'Contacto — Labrego',
        description: 'Contáctanos por WhatsApp o correo para alianzas comerciales o información sobre nuestros productos agropecuarios. Sede en Trujillo, Valle del Cauca.',
        path: '/contacto',
    });

    const office = useOfficeStatus();
    const officeOpen = office.open;
    const [channelsRef, channelsVisible] = useReveal(0.15);
    const [data, setData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [sent, setSent] = useState(false);

    const update = (k) => (e) => setData(d => ({ ...d, [k]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!data.name.trim()) e.name = 'Escribe tu nombre.';
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'El correo no es válido.';
        if (data.phone.replace(/\D/g, '').length < 7) e.phone = 'Escribe un teléfono válido.';
        if (!data.subject) e.subject = 'Selecciona un asunto.';
        if (data.message.trim().length < 10) e.message = 'Cuéntanos un poco más (mínimo 10 caracteres).';
        return e;
    };

    const message = [
        `*Mensaje desde la web — ${data.subject}*`,
        '',
        data.message.trim(),
        '',
        `*Nombre:* ${data.name}`,
        `*Teléfono:* ${data.phone}`,
        ...(data.email ? [`*Correo:* ${data.email}`] : []),
    ].join('\n');
    const whatsappHref = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    const mailHref = `mailto:${EMAIL}?subject=${encodeURIComponent(`${data.subject} — ${data.name}`)}&body=${encodeURIComponent(message.replace(/\*/g, ''))}`;

    const handleSubmit = (ev) => {
        ev.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;
        window.open(whatsappHref, '_blank', 'noopener,noreferrer');
        setSent(true);
    };

    const reset = () => {
        setData(emptyForm);
        setSent(false);
    };

    return (
        <div className="contact-page">
            <section className="page-header contact-header">
                <div className="container">
                    <span className="hero-eyebrow">
                        <MessageCircle size={14} /> Hablemos
                    </span>
                    <h1 className="page-title">
                        Estamos a un <span className="gradient-text">mensaje de distancia</span>
                    </h1>
                    <p className="page-subtitle">
                        Escríbenos por WhatsApp o correo. Respondemos en horario de oficina, normalmente el mismo día.
                    </p>
                    <span className={`contact-status ${officeOpen ? 'open' : 'closed'}`}>
                        <span className="contact-status-dot" aria-hidden="true" />
                        {officeOpen ? 'Abierto ahora · te respondemos en minutos' : 'Fuera de horario · te respondemos en la próxima jornada'}
                    </span>
                </div>
            </section>

            {/* Canales rápidos */}
            <section className="contact-channels-section">
                <div className="container">
                    <div className={`contact-channels reveal-stagger ${channelsVisible ? 'visible' : ''}`} ref={channelsRef}>
                        <div className="contact-channel contact-channel-whatsapp">
                            <span className="contact-channel-watermark" aria-hidden="true"><WhatsAppIcon size={150} /></span>
                            <div className="contact-channel-top">
                                <span className="contact-channel-icon"><WhatsAppIcon size={28} /></span>
                                <span className="contact-channel-badge">Respuesta rápida</span>
                            </div>
                            <span className="contact-channel-label">WhatsApp</span>
                            <strong>{WHATSAPP_DISPLAY}</strong>
                            <div className="contact-channel-actions">
                                <a className="contact-channel-cta" href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noopener noreferrer">
                                    Escribir ahora <ArrowUpRight size={16} />
                                </a>
                                <CopyButton value={WHATSAPP_DISPLAY} label="número de WhatsApp" />
                            </div>
                        </div>

                        <div className="contact-channel contact-channel-mail">
                            <div className="contact-channel-top">
                                <span className="contact-channel-icon"><GmailIcon size={30} /></span>
                                <span className="contact-channel-badge">Cotizaciones y facturas</span>
                            </div>
                            <span className="contact-channel-label">Correo</span>
                            <strong>{EMAIL}</strong>
                            <div className="contact-channel-actions">
                                <a className="contact-channel-cta" href={`mailto:${EMAIL}`}>
                                    Enviar correo <ArrowUpRight size={16} />
                                </a>
                                <CopyButton value={EMAIL} label="correo" />
                            </div>
                        </div>

                        <div className="contact-channel contact-channel-hours">
                            <div className="contact-channel-top">
                                <span className="contact-channel-icon"><Clock size={26} /></span>
                                <span className={`contact-channel-badge ${office.open ? 'open' : 'closed'}`}>
                                    <span className="contact-status-dot" aria-hidden="true" />
                                    {office.open ? 'Abierto' : 'Cerrado'}
                                </span>
                            </div>
                            <span className="contact-channel-label">Horario de atención</span>
                            <div className="contact-week" aria-label="Días de atención: lunes a viernes">
                                {WEEK.map((d, i) => (
                                    <span
                                        key={i}
                                        className={`${OFFICE_DAYS.includes(i) ? 'on' : ''} ${i === office.day ? 'today' : ''}`}
                                        title={WEEK_NAMES[i]}
                                    >
                                        {d}
                                    </span>
                                ))}
                            </div>
                            <div className="contact-shifts">
                                {OFFICE_SHIFTS.map((shift, i) => (
                                    <span key={i} className={office.current === i ? 'now' : ''}>
                                        {i === 0 ? <Sun size={15} /> : <Sunset size={15} />}
                                        {formatHour(shift.from)} – {formatHour(shift.to)}
                                    </span>
                                ))}
                            </div>
                            <span className="contact-office-text">{office.text}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Formulario + información */}
            <section className="contact-main">
                <div className="container contact-grid">
                    <aside className="contact-info">
                        <span className="contact-info-leaf" aria-hidden="true"><Sprout size={120} strokeWidth={1} /></span>
                        <h2 className="contact-info-title">Dónde encontrarnos</h2>
                        <ul className="contact-list">
                            <li>
                                <span className="contact-icon"><MapPin size={18} /></span>
                                <div>
                                    <strong>Sede principal</strong>
                                    <span>Carrera 6 #5-42, Centro, Trujillo, Valle del Cauca, Colombia</span>
                                </div>
                            </li>
                            <li>
                                <span className="contact-icon"><Sprout size={18} /></span>
                                <div>
                                    <strong>Operación de campo</strong>
                                    <span>Centro y norte del Valle del Cauca — Trujillo, Riofrío, Bolívar, Roldanillo</span>
                                </div>
                            </li>
                            <li>
                                <span className="contact-icon"><Clock size={18} /></span>
                                <div>
                                    <strong>Horario de atención</strong>
                                    <span>{OFFICE_HOURS_TEXT}</span>
                                </div>
                            </li>
                        </ul>

                        <div className="contact-quote-hint">
                            <ClipboardList size={20} />
                            <p>
                                ¿Necesitas precios? Usa el botón <Link to="/cotizar">Cotizar</Link> y arma tu
                                pedido en 3 pasos.
                            </p>
                        </div>
                    </aside>

                    <div className="contact-form-wrap">
                        {sent ? (
                            <div className="contact-success">
                                <span className="contact-success-icon"><CheckCircle size={56} strokeWidth={1.6} /></span>
                                <h2>¡Tu mensaje está listo!</h2>
                                <p>
                                    Abrimos WhatsApp con tu mensaje. Solo presiona <strong>enviar</strong> en el chat.
                                    Si prefieres, también puedes mandarlo por correo.
                                </p>
                                <div className="contact-success-actions">
                                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                        Abrir WhatsApp de nuevo <ArrowUpRight size={18} />
                                    </a>
                                    <a href={mailHref} className="btn btn-outline">
                                        <Mail size={18} /> Enviar por correo
                                    </a>
                                </div>
                                <button type="button" className="contact-link-btn" onClick={reset}>
                                    Escribir otro mensaje
                                </button>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit} noValidate>
                                <h2 className="contact-form-title">Envíanos un mensaje</h2>
                                <p className="contact-form-desc">Llega directo a nuestro WhatsApp. Los campos con * son obligatorios.</p>

                                <fieldset className="contact-subjects">
                                    <legend>Asunto *</legend>
                                    <div>
                                        {SUBJECTS.map(s => (
                                            <label key={s} className={data.subject === s ? 'active' : ''}>
                                                <input type="radio" name="subject" value={s} checked={data.subject === s} onChange={update('subject')} />
                                                {s}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.subject && <span className="field-error">{errors.subject}</span>}
                                </fieldset>

                                <div className="contact-form-grid">
                                    <div className="form-group">
                                        <label htmlFor="c-name">Nombre completo *</label>
                                        <input id="c-name" type="text" autoComplete="name" className={`form-control ${errors.name ? 'error' : ''}`} value={data.name} onChange={update('name')} placeholder="Tu nombre" />
                                        {errors.name && <span className="field-error">{errors.name}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="c-phone">Teléfono *</label>
                                        <input id="c-phone" type="tel" autoComplete="tel" className={`form-control ${errors.phone ? 'error' : ''}`} value={data.phone} onChange={update('phone')} placeholder="+57 300 000 0000" />
                                        {errors.phone && <span className="field-error">{errors.phone}</span>}
                                    </div>
                                    <div className="form-group form-group-full">
                                        <label htmlFor="c-email">Correo electrónico</label>
                                        <input id="c-email" type="email" autoComplete="email" className={`form-control ${errors.email ? 'error' : ''}`} value={data.email} onChange={update('email')} placeholder="tucorreo@ejemplo.com (opcional)" />
                                        {errors.email && <span className="field-error">{errors.email}</span>}
                                    </div>
                                    <div className="form-group form-group-full">
                                        <label htmlFor="c-message">Mensaje *</label>
                                        <textarea id="c-message" rows="5" className={`form-control ${errors.message ? 'error' : ''}`} value={data.message} onChange={update('message')} placeholder="Cuéntanos cómo podemos ayudarte" />
                                        {errors.message && <span className="field-error">{errors.message}</span>}
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary contact-submit">
                                    Enviar por WhatsApp <Send size={16} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <section className="contact-map-section">
                <div className="container">
                    <div className="contact-map">
                        <iframe
                            title="Ubicación Labrego — Trujillo, Valle del Cauca"
                            src="https://www.google.com/maps?q=Trujillo,+Valle+del+Cauca,+Colombia&hl=es&z=13&output=embed"
                            width="100%"
                            height="440"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                        <div className="contact-map-card">
                            <span className="contact-icon"><MapPin size={18} /></span>
                            <div>
                                <strong>Labrego S.A.S.</strong>
                                <span>Carrera 6 #5-42, Trujillo, Valle del Cauca</span>
                                <a
                                    href="https://www.google.com/maps/dir/?api=1&destination=Trujillo,+Valle+del+Cauca,+Colombia"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Cómo llegar <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
