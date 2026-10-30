import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle, ClipboardCheck, Loader2, PackageCheck } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { formatCOP, formatQuantity } from '../data/products';
import './Confirm.css';

const formatDate = (iso) => new Date(iso).toLocaleDateString('es-CO', { dateStyle: 'long' });

/**
 * /confirmar?t=...  — el cliente llega desde el botón "Confirmar pedido" del
 * correo, revisa su cotización y la confirma. Al confirmar, la empresa recibe
 * la orden de venta por correo.
 */
function Confirm() {
    useSeo({ title: 'Confirmar pedido — Labrego', description: 'Confirma tu cotización de Labrego.', path: '/confirmar' });

    const [searchParams] = useSearchParams();
    const token = searchParams.get('t');
    const [quote, setQuote] = useState(null);
    const [state, setState] = useState(token ? 'loading' : 'invalid'); // loading | ready | sending | done | invalid | error
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) return;
        let cancelled = false;
        fetch(`/api/confirm?t=${encodeURIComponent(token)}`)
            .then(async (r) => {
                const data = await r.json().catch(() => ({}));
                if (cancelled) return;
                if (!r.ok) { setMessage(data.error || ''); setState('invalid'); return; }
                setQuote(data);
                setState('ready');
            })
            .catch(() => { if (!cancelled) { setMessage('No hay conexión con el servidor.'); setState('invalid'); } });
        return () => { cancelled = true; };
    }, [token]);

    const confirm = async () => {
        setState('sending');
        try {
            const r = await fetch('/api/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ t: token }),
            });
            const data = await r.json().catch(() => ({}));
            if (!r.ok) throw new Error(data.error || 'No pudimos confirmar el pedido.');
            setState('done');
        } catch (err) {
            setMessage(err.message);
            setState('error');
        }
    };

    return (
        <div className="confirm-page">
            <section className="page-header confirm-header">
                <div className="container">
                    <span className="hero-eyebrow"><ClipboardCheck size={14} /> Confirmación de pedido</span>
                    <h1 className="page-title">Confirma tu <span className="gradient-text">pedido</span></h1>
                </div>
            </section>

            <section className="confirm-section">
                <div className="container">
                    <div className="confirm-card">
                        {state === 'loading' && (
                            <div className="confirm-state">
                                <Loader2 size={40} className="confirm-spin" />
                                <p>Cargando tu cotización...</p>
                            </div>
                        )}

                        {state === 'invalid' && (
                            <div className="confirm-state">
                                <span className="confirm-icon warn"><AlertTriangle size={40} /></span>
                                <h2>No encontramos esta cotización</h2>
                                <p>{message || 'El enlace está incompleto. Ábrelo de nuevo desde el botón del correo.'}</p>
                                <Link to="/cotizar" className="btn btn-primary">Hacer una cotización</Link>
                            </div>
                        )}

                        {state === 'done' && (
                            <div className="confirm-state">
                                <span className="confirm-icon ok"><CheckCircle size={48} strokeWidth={1.6} /></span>
                                <h2>¡Pedido confirmado!</h2>
                                <p>
                                    Tu orden <strong>{quote.orderRef}</strong> llegó a nuestro equipo comercial. Te enviamos una
                                    copia en PDF a <strong>{quote.client.email}</strong> y te contactaremos para coordinar la entrega.
                                </p>
                                <Link to="/" className="btn btn-outline">Volver al inicio</Link>
                            </div>
                        )}

                        {quote && ['ready', 'sending', 'error'].includes(state) && (
                            <>
                                <div className="confirm-head">
                                    <span className="confirm-icon"><PackageCheck size={28} /></span>
                                    <div>
                                        <span className="confirm-ref">Cotización {quote.reference}</span>
                                        <h2>{quote.client.company || quote.client.name}</h2>
                                        <p>Entrega en {quote.city} · cotizada el {formatDate(quote.issuedAt)}</p>
                                    </div>
                                </div>

                                <ul className="confirm-lines">
                                    {quote.pricing.lines.map(l => (
                                        <li key={l.slug}>
                                            <div>
                                                <strong>{l.name}</strong>
                                                <span>{formatQuantity(l.quantity)} {l.unit} · {l.frequency}</span>
                                            </div>
                                            <strong>{l.subtotal === null ? 'A convenir' : formatCOP(l.subtotal)}</strong>
                                        </li>
                                    ))}
                                </ul>
                                <div className="confirm-total">
                                    <span>Total por entrega</span>
                                    <strong>{formatCOP(quote.pricing.total)}</strong>
                                </div>
                                {quote.pricing.hasUnpriced && (
                                    <p className="confirm-note">Los productos "a convenir" se cotizan aparte.</p>
                                )}

                                {quote.expired ? (
                                    <div className="confirm-alert">
                                        Esta cotización venció el {formatDate(quote.validUntil)}. Haz una nueva para tener precios actualizados.
                                        <Link to="/cotizar" className="btn btn-primary">Cotizar de nuevo</Link>
                                    </div>
                                ) : (
                                    <>
                                        {state === 'error' && <div className="confirm-alert">{message}</div>}
                                        <button type="button" className="btn btn-primary confirm-btn" onClick={confirm} disabled={state === 'sending'}>
                                            {state === 'sending'
                                                ? <>Confirmando... <Loader2 size={18} className="confirm-spin" /></>
                                                : <>Confirmar pedido <CheckCircle size={18} /></>}
                                        </button>
                                        <p className="confirm-note">
                                            Válida hasta el {formatDate(quote.validUntil)}. Al confirmar, Labrego recibe la orden de venta
                                            y te contacta para coordinar la entrega.
                                        </p>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Confirm;
