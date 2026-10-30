import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle,
    ClipboardList,
    Mail,
    Minus,
    Package,
    Plus,
    Search,
    Trash2,
    Truck,
    User,
} from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import ProductImage from '../components/ProductImage';
import { catalog, findProduct } from '../data/products';
import { WHATSAPP_PHONE } from '../data/contact';
import './Quote.css';

const DRAFT_KEY = 'labrego-quote-draft';

const UNITS = ['kg', 'toneladas', 'canastillas', 'cajas', 'bultos', 'unidades'];

const FREQUENCIES = ['Pedido único', 'Semanal', 'Quincenal', 'Mensual'];

const CLIENT_TYPES = [
    'Supermercado / Retail',
    'Plaza de mercado',
    'Mayorista / Distribuidor',
    'Industria procesadora',
    'Restaurante / Foodservice',
    'Exportación',
    'Otro',
];

const STEPS = [
    { id: 0, label: 'Productos', icon: Package },
    { id: 1, label: 'Entrega', icon: Truck },
    { id: 2, label: 'Tus datos', icon: User },
];

const emptyDraft = {
    items: [],
    frequency: 'Semanal',
    startDate: '',
    city: '',
    clientType: '',
    notes: '',
    name: '',
    company: '',
    nit: '',
    role: '',
    phone: '',
    email: '',
    accept: false,
};

function loadDraft() {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return emptyDraft;
        const saved = JSON.parse(raw);
        // Solo conserva productos que sigan existiendo en el catálogo
        const items = (saved.items || []).filter(it => findProduct(it.slug));
        return { ...emptyDraft, ...saved, items };
    } catch {
        return emptyDraft;
    }
}

function buildMessage(d) {
    const optional = (value, line) => (value ? [line] : []);
    return [
        '*Solicitud de cotización — Labrego*',
        '',
        '*Productos:*',
        ...d.items.map(it => {
            const p = findProduct(it.slug);
            return `• ${p.name}: ${it.quantity} ${it.unit}${it.note ? ` (${it.note})` : ''}`;
        }),
        '',
        `*Frecuencia:* ${d.frequency}`,
        ...optional(d.startDate, `*Primera entrega:* ${d.startDate}`),
        `*Ciudad de entrega:* ${d.city}`,
        ...optional(d.clientType, `*Tipo de cliente:* ${d.clientType}`),
        ...optional(d.notes, `*Observaciones:* ${d.notes}`),
        '',
        `*Contacto:* ${d.name}${d.role ? ` — ${d.role}` : ''}`,
        ...optional(d.company, `*Empresa:* ${d.company}${d.nit ? ` (NIT ${d.nit})` : ''}`),
        `*Teléfono:* ${d.phone}`,
        ...optional(d.email, `*Correo:* ${d.email}`),
    ].join('\n');
}

function Quote() {
    useSeo({
        title: 'Cotizar pedido — Labrego',
        description: 'Solicita una cotización de plátano, banano, aguacate, limón y cárnicos para tu empresa. Indica productos, volumen, frecuencia y ciudad de entrega.',
        path: '/cotizar',
    });

    const [searchParams] = useSearchParams();
    // Borrador guardado + producto precargado desde /productos o el inicio (?producto=slug)
    const [draft, setDraft] = useState(() => {
        const saved = loadDraft();
        const slug = searchParams.get('producto');
        if (!slug || !findProduct(slug) || saved.items.some(it => it.slug === slug)) return saved;
        return { ...saved, items: [...saved.items, { slug, quantity: 100, unit: 'kg', note: '' }] };
    });
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [search, setSearch] = useState('');
    const [sent, setSent] = useState(false);

    useEffect(() => {
        try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* sin almacenamiento */ }
    }, [draft]);

    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step, sent]);

    const set = (key) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setDraft(d => ({ ...d, [key]: value }));
    };

    const isSelected = (slug) => draft.items.some(it => it.slug === slug);

    const toggleProduct = (slug) => {
        setDraft(d => ({
            ...d,
            items: isSelected(slug)
                ? d.items.filter(it => it.slug !== slug)
                : [...d.items, { slug, quantity: 100, unit: 'kg', note: '' }],
        }));
        setErrors(e => ({ ...e, items: undefined }));
    };

    const updateItem = (slug, patch) => {
        setDraft(d => ({ ...d, items: d.items.map(it => (it.slug === slug ? { ...it, ...patch } : it)) }));
    };

    const stepQty = (slug, delta) => {
        const it = draft.items.find(i => i.slug === slug);
        updateItem(slug, { quantity: Math.max(1, (Number(it.quantity) || 0) + delta) });
    };

    const visibleCatalog = useMemo(() => {
        const q = search.trim().toLowerCase();
        return q ? catalog.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : catalog;
    }, [search]);

    const validate = (s) => {
        const e = {};
        if (s === 0) {
            if (!draft.items.length) e.items = 'Agrega al menos un producto a tu cotización.';
            if (draft.items.some(it => !(Number(it.quantity) > 0))) e.items = 'Revisa las cantidades: deben ser mayores a cero.';
        }
        if (s === 1) {
            if (!draft.city.trim()) e.city = 'Indica la ciudad de entrega.';
            if (!draft.clientType) e.clientType = 'Selecciona el tipo de cliente.';
        }
        if (s === 2) {
            if (!draft.name.trim()) e.name = 'Escribe tu nombre.';
            if (draft.phone.replace(/\D/g, '').length < 7) e.phone = 'Escribe un teléfono válido.';
            if (draft.email && !/^\S+@\S+\.\S+$/.test(draft.email)) e.email = 'El correo no es válido.';
            if (!draft.accept) e.accept = 'Debes aceptar la política de privacidad.';
        }
        return e;
    };

    const next = () => {
        const e = validate(step);
        setErrors(e);
        if (Object.keys(e).length) return;
        setStep(s => Math.min(s + 1, STEPS.length - 1));
    };

    const back = () => { setErrors({}); setStep(s => Math.max(s - 1, 0)); };

    const goTo = (target) => {
        if (target <= step) { setErrors({}); setStep(target); return; }
        for (let s = step; s < target; s++) {
            const e = validate(s);
            if (Object.keys(e).length) { setErrors(e); setStep(s); return; }
        }
        setStep(target);
    };

    const message = buildMessage(draft);
    const whatsappHref = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    const mailHref = `mailto:comercial@labrego.com?subject=${encodeURIComponent(`Cotización — ${draft.company || draft.name}`)}&body=${encodeURIComponent(message.replace(/\*/g, ''))}`;

    const submit = (ev) => {
        ev.preventDefault();
        const e = validate(2);
        setErrors(e);
        if (Object.keys(e).length) return;
        window.open(whatsappHref, '_blank', 'noopener,noreferrer');
        setSent(true);
    };

    const startOver = () => {
        setDraft(emptyDraft);
        setStep(0);
        setSent(false);
    };

    return (
        <div className="quote-page">
            <section className="page-header quote-header">
                <div className="container">
                    <span className="hero-eyebrow">
                        <ClipboardList size={14} /> Cotización empresarial
                    </span>
                    <h1 className="page-title">
                        Cotiza tu pedido <span className="gradient-text">en 3 pasos</span>
                    </h1>
                    <p className="page-subtitle">
                        Elige productos y volúmenes, cuéntanos dónde entregar y recibe una propuesta comercial en menos de 24 horas hábiles.
                    </p>
                </div>
            </section>

            <section className="section quote-section">
                <div className="container">
                    {sent ? (
                        <div className="quote-done">
                            <span className="quote-done-icon"><CheckCircle size={56} strokeWidth={1.6} /></span>
                            <h2>¡Tu solicitud está lista!</h2>
                            <p>
                                Abrimos WhatsApp con el resumen de tu pedido. Solo presiona <strong>enviar</strong> en el chat
                                y nuestro equipo comercial te responderá en menos de 24 horas hábiles.
                            </p>
                            <div className="quote-done-actions">
                                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    Abrir WhatsApp de nuevo <ArrowRight size={18} />
                                </a>
                                <a href={mailHref} className="btn btn-outline">
                                    <Mail size={18} /> Enviar por correo
                                </a>
                            </div>
                            <button type="button" className="quote-link-btn" onClick={startOver}>
                                Hacer otra cotización
                            </button>
                        </div>
                    ) : (
                        <>
                            <ol className="quote-steps" aria-label="Pasos de la cotización">
                                {STEPS.map(s => {
                                    const Icon = s.icon;
                                    const state = s.id < step ? 'done' : s.id === step ? 'current' : '';
                                    return (
                                        <li key={s.id} className={`quote-step ${state}`}>
                                            <button type="button" onClick={() => goTo(s.id)} aria-current={s.id === step ? 'step' : undefined}>
                                                <span className="quote-step-dot">
                                                    {s.id < step ? <Check size={16} /> : <Icon size={16} />}
                                                </span>
                                                <span className="quote-step-label">{s.label}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ol>

                            <div className="quote-layout">
                                <form className="quote-main" onSubmit={submit} noValidate>
                                    {step === 0 && (
                                        <div className="quote-panel" key="step-0">
                                            <div className="quote-panel-head">
                                                <h2>¿Qué productos necesitas?</h2>
                                                <p>Toca un producto para agregarlo. Luego ajusta cantidad y unidad.</p>
                                            </div>

                                            <label className="quote-search">
                                                <Search size={18} aria-hidden="true" />
                                                <input
                                                    type="search"
                                                    placeholder="Buscar producto o categoría..."
                                                    value={search}
                                                    onChange={e => setSearch(e.target.value)}
                                                    aria-label="Buscar producto"
                                                />
                                            </label>

                                            <div className="quote-picker">
                                                {visibleCatalog.map(p => {
                                                    const active = isSelected(p.slug);
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={p.slug}
                                                            className={`quote-pick ${active ? 'active' : ''}`}
                                                            onClick={() => toggleProduct(p.slug)}
                                                            aria-pressed={active}
                                                        >
                                                            <span className="quote-pick-img">
                                                                <ProductImage src={p.image} alt="" name={p.name} />
                                                            </span>
                                                            <span className="quote-pick-name">{p.name}</span>
                                                            <span className="quote-pick-cat">{p.category}</span>
                                                            <span className="quote-pick-check" aria-hidden="true">
                                                                {active ? <Check size={14} /> : <Plus size={14} />}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {draft.items.length > 0 && (
                                                <div className="quote-items">
                                                    <h3>Cantidades</h3>
                                                    {draft.items.map(it => {
                                                        const p = findProduct(it.slug);
                                                        return (
                                                            <div className="quote-item" key={it.slug}>
                                                                <span className="quote-item-img">
                                                                    <ProductImage src={p.image} alt="" name={p.name} />
                                                                </span>
                                                                <div className="quote-item-info">
                                                                    <strong>{p.name}</strong>
                                                                    <input
                                                                        type="text"
                                                                        className="quote-item-note"
                                                                        placeholder="Calibre, presentación, madurez... (opcional)"
                                                                        value={it.note}
                                                                        onChange={e => updateItem(it.slug, { note: e.target.value })}
                                                                        aria-label={`Detalle para ${p.name}`}
                                                                    />
                                                                </div>
                                                                <div className="quote-qty">
                                                                    <button type="button" onClick={() => stepQty(it.slug, -10)} aria-label="Restar">
                                                                        <Minus size={14} />
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        inputMode="numeric"
                                                                        value={it.quantity}
                                                                        onChange={e => updateItem(it.slug, { quantity: e.target.value })}
                                                                        aria-label={`Cantidad de ${p.name}`}
                                                                    />
                                                                    <button type="button" onClick={() => stepQty(it.slug, 10)} aria-label="Sumar">
                                                                        <Plus size={14} />
                                                                    </button>
                                                                </div>
                                                                <select
                                                                    className="quote-unit"
                                                                    value={it.unit}
                                                                    onChange={e => updateItem(it.slug, { unit: e.target.value })}
                                                                    aria-label={`Unidad de ${p.name}`}
                                                                >
                                                                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                                                </select>
                                                                <button
                                                                    type="button"
                                                                    className="quote-item-remove"
                                                                    onClick={() => toggleProduct(it.slug)}
                                                                    aria-label={`Quitar ${p.name}`}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            {errors.items && <p className="field-error quote-error">{errors.items}</p>}
                                        </div>
                                    )}

                                    {step === 1 && (
                                        <div className="quote-panel" key="step-1">
                                            <div className="quote-panel-head">
                                                <h2>¿Cómo y dónde entregamos?</h2>
                                                <p>Con esto calculamos logística y precio por volumen.</p>
                                            </div>

                                            <fieldset className="quote-field">
                                                <legend>Frecuencia de compra</legend>
                                                <div className="quote-segment">
                                                    {FREQUENCIES.map(f => (
                                                        <label key={f} className={draft.frequency === f ? 'active' : ''}>
                                                            <input type="radio" name="frequency" value={f} checked={draft.frequency === f} onChange={set('frequency')} />
                                                            {f}
                                                        </label>
                                                    ))}
                                                </div>
                                            </fieldset>

                                            <div className="quote-grid-2">
                                                <div className="form-group">
                                                    <label htmlFor="q-city">Ciudad de entrega *</label>
                                                    <input id="q-city" type="text" className={`form-control ${errors.city ? 'error' : ''}`} value={draft.city} onChange={set('city')} placeholder="ej. Cali, Valle del Cauca" />
                                                    {errors.city && <span className="field-error">{errors.city}</span>}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="q-date">Primera entrega (aprox.)</label>
                                                    <input id="q-date" type="date" className="form-control" value={draft.startDate} onChange={set('startDate')} />
                                                </div>
                                            </div>

                                            <fieldset className="quote-field">
                                                <legend>Tipo de cliente *</legend>
                                                <div className="quote-chips">
                                                    {CLIENT_TYPES.map(c => (
                                                        <label key={c} className={draft.clientType === c ? 'active' : ''}>
                                                            <input type="radio" name="clientType" value={c} checked={draft.clientType === c} onChange={set('clientType')} />
                                                            {c}
                                                        </label>
                                                    ))}
                                                </div>
                                                {errors.clientType && <span className="field-error">{errors.clientType}</span>}
                                            </fieldset>

                                            <div className="form-group">
                                                <label htmlFor="q-notes">Observaciones</label>
                                                <textarea id="q-notes" rows="3" className="form-control" value={draft.notes} onChange={set('notes')} placeholder="Horario de recibo, requisitos de calidad, empaque especial..." />
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="quote-panel" key="step-2">
                                            <div className="quote-panel-head">
                                                <h2>¿A quién le enviamos la propuesta?</h2>
                                                <p>Te contactamos por WhatsApp o correo, como prefieras.</p>
                                            </div>
                                            <div className="quote-grid-2">
                                                <div className="form-group">
                                                    <label htmlFor="q-name">Nombre completo *</label>
                                                    <input id="q-name" type="text" autoComplete="name" className={`form-control ${errors.name ? 'error' : ''}`} value={draft.name} onChange={set('name')} />
                                                    {errors.name && <span className="field-error">{errors.name}</span>}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="q-role">Cargo</label>
                                                    <input id="q-role" type="text" autoComplete="organization-title" className="form-control" value={draft.role} onChange={set('role')} placeholder="ej. Jefe de compras" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="q-company">Empresa</label>
                                                    <input id="q-company" type="text" autoComplete="organization" className="form-control" value={draft.company} onChange={set('company')} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="q-nit">NIT</label>
                                                    <input id="q-nit" type="text" className="form-control" value={draft.nit} onChange={set('nit')} placeholder="Opcional" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="q-phone">Teléfono / WhatsApp *</label>
                                                    <input id="q-phone" type="tel" autoComplete="tel" className={`form-control ${errors.phone ? 'error' : ''}`} value={draft.phone} onChange={set('phone')} placeholder="+57 300 000 0000" />
                                                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="q-email">Correo</label>
                                                    <input id="q-email" type="email" autoComplete="email" className={`form-control ${errors.email ? 'error' : ''}`} value={draft.email} onChange={set('email')} />
                                                    {errors.email && <span className="field-error">{errors.email}</span>}
                                                </div>
                                            </div>
                                            <label className={`quote-accept ${errors.accept ? 'error' : ''}`}>
                                                <input type="checkbox" checked={draft.accept} onChange={set('accept')} />
                                                <span>
                                                    Acepto el tratamiento de mis datos según la{' '}
                                                    <Link to="/privacidad" target="_blank">política de privacidad</Link>.
                                                </span>
                                            </label>
                                            {errors.accept && <span className="field-error">{errors.accept}</span>}
                                        </div>
                                    )}

                                    <div className="quote-nav">
                                        {step > 0 ? (
                                            <button type="button" className="btn btn-outline" onClick={back}>
                                                <ArrowLeft size={18} /> Atrás
                                            </button>
                                        ) : <span />}
                                        {step < STEPS.length - 1 ? (
                                            <button type="button" className="btn btn-primary" onClick={next}>
                                                Continuar <ArrowRight size={18} />
                                            </button>
                                        ) : (
                                            <button type="submit" className="btn btn-primary quote-submit">
                                                Enviar por WhatsApp <ArrowRight size={18} />
                                            </button>
                                        )}
                                    </div>
                                </form>

                                <aside className="quote-summary" aria-label="Resumen de la cotización">
                                    <h3>Resumen</h3>
                                    {draft.items.length === 0 ? (
                                        <p className="quote-summary-empty">Aún no has agregado productos.</p>
                                    ) : (
                                        <ul className="quote-summary-list">
                                            {draft.items.map(it => {
                                                const p = findProduct(it.slug);
                                                return (
                                                    <li key={it.slug}>
                                                        <span>{p.name}</span>
                                                        <strong>{it.quantity || 0} {it.unit}</strong>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                    <dl className="quote-summary-meta">
                                        <div><dt>Frecuencia</dt><dd>{draft.frequency}</dd></div>
                                        <div><dt>Entrega</dt><dd>{draft.city || '—'}</dd></div>
                                        <div><dt>Cliente</dt><dd>{draft.clientType || '—'}</dd></div>
                                    </dl>
                                    <p className="quote-summary-note">
                                        Respuesta en menos de 24 h hábiles · Precios según volumen y temporada.
                                    </p>
                                </aside>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Quote;
