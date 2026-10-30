import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle,
    ClipboardList,
    Download,
    FileText,
    Loader2,
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
import PlaceCombobox from '../components/PlaceCombobox';
import { catalog, findProduct, formatCOP } from '../data/products';
import { CLIENT_TYPES, DEFAULT_FREQUENCY, FREQUENCIES, UNITS } from '../data/quoteOptions';
import { WHATSAPP_PHONE } from '../data/contact';
import { priceItems, QUOTE_VALID_DAYS } from '../lib/pricing';
import './Quote.css';

const DRAFT_KEY = 'labrego-quote-draft';

const newItem = (slug) => ({ slug, quantity: 100, unit: 'kg', frequency: DEFAULT_FREQUENCY, note: '' });

const STEPS = [
    { id: 0, label: 'Productos', icon: Package },
    { id: 1, label: 'Entrega', icon: Truck },
    { id: 2, label: 'Tus datos', icon: User },
];

const emptyDraft = {
    items: [],
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
    website: '', // campo trampa para robots (oculto)
};

function loadDraft() {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return emptyDraft;
        const saved = JSON.parse(raw);
        // Solo conserva productos que sigan existiendo en el catálogo. Los
        // borradores antiguos tenían una sola frecuencia para todo el pedido.
        const items = (saved.items || [])
            .filter(it => findProduct(it.slug))
            .map(it => ({
                ...it,
                frequency: it.frequency || saved.frequency || DEFAULT_FREQUENCY,
                // Antes se podía cotizar en cajas o canastillas; ahora solo kg o toneladas
                unit: UNITS.includes(it.unit) ? it.unit : 'kg',
            }));
        delete saved.frequency;
        return { ...emptyDraft, ...saved, items };
    } catch {
        return emptyDraft;
    }
}

const toPayload = (d) => ({
    client: { name: d.name, role: d.role, company: d.company, nit: d.nit, phone: d.phone, email: d.email },
    delivery: { city: d.city, startDate: d.startDate, clientType: d.clientType, notes: d.notes },
    items: d.items.map(({ slug, quantity, unit, frequency, note }) => ({ slug, quantity: Number(quantity), unit, frequency, note })),
    website: d.website,
});

// Datos para armar el PDF en el navegador (respaldo si falla el envío)
const toPdfData = (d, reference, issuedAt) => ({
    reference,
    issuedAt,
    validUntil: new Date(new Date(issuedAt).getTime() + QUOTE_VALID_DAYS * 86_400_000).toISOString(),
    client: toPayload(d).client,
    delivery: toPayload(d).delivery,
    pricing: priceItems(d.items),
});

// Mensaje de WhatsApp de respaldo si el correo no se puede enviar
function buildMessage(d) {
    const pricing = priceItems(d.items);
    return [
        '*Solicitud de cotización — Labrego*',
        '',
        ...pricing.lines.map(l => `• ${l.name}: ${l.quantity} ${l.unit} — ${l.frequency}`),
        '',
        `*Ciudad de entrega:* ${d.city}`,
        `*Contacto:* ${d.name} · ${d.phone} · ${d.email}`,
        ...(d.company ? [`*Empresa:* ${d.company}`] : []),
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
        return { ...saved, items: [...saved.items, newItem(slug)] };
    });
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error
    const [result, setResult] = useState(null); // respuesta del servidor
    const [sendError, setSendError] = useState('');
    const [pdfStatus, setPdfStatus] = useState('idle'); // idle | generating | ready | error
    const sent = status === 'sent';

    const pricing = useMemo(() => priceItems(draft.items), [draft.items]);

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
                : [...d.items, newItem(slug)],
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
            if (!/^\S+@\S+\.\S+$/.test(draft.email)) e.email = 'Escribe un correo válido: ahí te llega la cotización.';
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

    // El generador de PDF (jsPDF) se carga solo cuando se necesita
    const downloadPdf = async (reference, issuedAt) => {
        setPdfStatus('generating');
        try {
            const { downloadPdf: download } = await import('../lib/quotePdf');
            await download('quote', toPdfData(draft, reference, issuedAt));
            setPdfStatus('ready');
        } catch (err) {
            console.error('No se pudo generar el PDF de la cotización', err);
            setPdfStatus('error');
        }
    };

    const submit = async (ev) => {
        ev.preventDefault();
        if (status === 'sending') return;
        const e = validate(2);
        setErrors(e);
        if (Object.keys(e).length) return;

        setStatus('sending');
        setSendError('');
        try {
            const response = await fetch('/api/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(toPayload(draft)),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || 'No pudimos enviar la cotización.');
            setResult({ ...data, issuedAt: new Date().toISOString() });
            setStatus('sent');
        } catch (err) {
            setSendError(err.message === 'Failed to fetch' ? 'No hay conexión con el servidor.' : err.message);
            setStatus('error');
        }
    };

    const startOver = () => {
        setDraft(emptyDraft);
        setStep(0);
        setStatus('idle');
        setResult(null);
        setPdfStatus('idle');
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
                            <h2>¡Te enviamos la cotización!</h2>
                            <p className="quote-done-ref">Referencia <strong>{result.reference}</strong></p>
                            <p>
                                Revisa tu correo <strong>{result.email}</strong>: ahí está el PDF con los precios y el botón
                                <strong> Confirmar pedido</strong>. Si no lo ves en unos minutos, busca en la carpeta de spam.
                            </p>
                            <div className="quote-done-total">
                                <span>Total por entrega</span>
                                <strong>{formatCOP(result.total)}</strong>
                                <small>Válida hasta el {new Date(result.validUntil).toLocaleDateString('es-CO', { dateStyle: 'long' })}</small>
                            </div>
                            <div className={`quote-pdf-card ${pdfStatus}`}>
                                <span className="quote-pdf-icon"><FileText size={26} strokeWidth={1.6} /></span>
                                <div>
                                    <strong>Cotizacion-{result.reference}.pdf</strong>
                                    <span>
                                        {pdfStatus === 'idle' && 'También puedes descargarla aquí'}
                                        {pdfStatus === 'generating' && 'Generando PDF...'}
                                        {pdfStatus === 'ready' && 'PDF descargado en tu equipo'}
                                        {pdfStatus === 'error' && 'No se pudo generar el PDF. Intenta de nuevo.'}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-outline quote-pdf-btn"
                                    onClick={() => downloadPdf(result.reference, result.issuedAt)}
                                    disabled={pdfStatus === 'generating'}
                                >
                                    {pdfStatus === 'generating'
                                        ? <Loader2 size={18} className="quote-spin" />
                                        : <Download size={18} />}
                                    Descargar PDF
                                </button>
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
                                                <p>Toca un producto para agregarlo y define cuánto y cada cuánto lo necesitas.</p>
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
                                                    <h3>Cantidad y frecuencia</h3>
                                                    {draft.items.map(it => {
                                                        const p = findProduct(it.slug);
                                                        return (
                                                            <div className="quote-item" key={it.slug}>
                                                                <span className="quote-item-img">
                                                                    <ProductImage src={p.image} alt="" name={p.name} />
                                                                </span>
                                                                <div className="quote-item-info">
                                                                    <strong>{p.name}</strong>
                                                                    <span className="quote-item-price">
                                                                        {p.price === null ? 'Precio a convenir' : `${formatCOP(p.price)} / kg`}
                                                                    </span>
                                                                    <input
                                                                        type="text"
                                                                        className="quote-item-note"
                                                                        placeholder="Calibre, presentación, madurez... (opcional)"
                                                                        value={it.note}
                                                                        onChange={e => updateItem(it.slug, { note: e.target.value })}
                                                                        aria-label={`Detalle para ${p.name}`}
                                                                    />
                                                                </div>
                                                                <div className="quote-order">
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
                                                                    <span className="quote-order-sep" aria-hidden="true">·</span>
                                                                    <select
                                                                        className="quote-unit quote-freq"
                                                                        value={it.frequency}
                                                                        onChange={e => updateItem(it.slug, { frequency: e.target.value })}
                                                                        aria-label={`Frecuencia de ${p.name}`}
                                                                    >
                                                                        {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                                                                    </select>
                                                                </div>
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

                                            <div className="quote-grid-2">
                                                <div className="form-group">
                                                    <label htmlFor="q-city">Ciudad de entrega *</label>
                                                    <PlaceCombobox
                                                        id="q-city"
                                                        value={draft.city}
                                                        onChange={(city) => setDraft(d => ({ ...d, city }))}
                                                        invalid={Boolean(errors.city)}
                                                        placeholder="Busca tu municipio o corregimiento"
                                                    />
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
                                                <h2>¿A quién le enviamos la cotización?</h2>
                                                <p>Te llega al correo en PDF, con los precios y un botón para confirmar el pedido.</p>
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
                                                    <label htmlFor="q-email">Correo (aquí te llega la cotización) *</label>
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
                                            <input
                                                type="text"
                                                name="website"
                                                className="quote-honeypot"
                                                tabIndex={-1}
                                                autoComplete="off"
                                                value={draft.website}
                                                onChange={set('website')}
                                                aria-hidden="true"
                                            />

                                            {status === 'error' && (
                                                <div className="quote-send-error" role="alert">
                                                    <strong>No pudimos enviar la cotización a tu correo.</strong>
                                                    <span>{sendError}</span>
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline"
                                                            onClick={() => downloadPdf(`LAB-${Date.now().toString(36).toUpperCase()}`, new Date().toISOString())}
                                                        >
                                                            <Download size={16} /> Descargar PDF
                                                        </button>
                                                        <a
                                                            className="btn btn-outline"
                                                            href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(buildMessage(draft))}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Enviar por WhatsApp
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
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
                                            <button type="submit" className="btn btn-primary quote-submit" disabled={status === 'sending'}>
                                                {status === 'sending'
                                                    ? <>Enviando... <Loader2 size={18} className="quote-spin" /></>
                                                    : <>Recibir cotización por correo <ArrowRight size={18} /></>}
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
                                            {pricing.lines.map(l => (
                                                <li key={l.slug}>
                                                    <span>{l.name}<small>{l.quantity || 0} {l.unit} · {l.frequency}</small></span>
                                                    <strong>{l.subtotal === null ? 'A convenir' : formatCOP(l.subtotal)}</strong>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {draft.items.length > 0 && (
                                        <div className="quote-summary-total">
                                            <span>Total por entrega</span>
                                            <strong>{formatCOP(pricing.total)}</strong>
                                        </div>
                                    )}
                                    <dl className="quote-summary-meta">
                                        <div><dt>Entrega</dt><dd>{draft.city || '—'}</dd></div>
                                        <div><dt>Cliente</dt><dd>{draft.clientType || '—'}</dd></div>
                                    </dl>
                                    <p className="quote-summary-note">
                                        Precios estándar por kilo en pesos colombianos.
                                        {pricing.hasUnpriced && ' Los productos "a convenir" se cotizan aparte.'}
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
