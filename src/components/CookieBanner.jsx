import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Check, Settings } from 'lucide-react';
import './CookieBanner.css';

const STORAGE_KEY = 'labrego_cookie_consent';

function readConsent() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function writeConsent(value) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...value, ts: Date.now() }));
    } catch {
        /* storage disabled — banner just won't persist */
    }
}

function CookieBanner() {
    const [visible, setVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [prefs, setPrefs] = useState({ analytics: true, marketing: false });

    useEffect(() => {
        const consent = readConsent();
        if (!consent) {
            const t = setTimeout(() => setVisible(true), 600);
            return () => clearTimeout(t);
        }
    }, []);

    const acceptAll = () => {
        writeConsent({ necessary: true, analytics: true, marketing: true, action: 'accept-all' });
        setVisible(false);
    };

    const rejectAll = () => {
        writeConsent({ necessary: true, analytics: false, marketing: false, action: 'reject-all' });
        setVisible(false);
    };

    const savePrefs = () => {
        writeConsent({ necessary: true, ...prefs, action: 'custom' });
        setShowSettings(false);
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className={`cookie-banner ${showSettings ? 'expanded' : ''}`} role="dialog" aria-live="polite" aria-label="Banner de cookies">
            <button className="cookie-close" onClick={rejectAll} aria-label="Cerrar y rechazar opcionales">
                <X size={18} />
            </button>

            <div className="cookie-content">
                <div className="cookie-icon">
                    <Cookie size={28} />
                </div>

                {!showSettings ? (
                    <div className="cookie-text">
                        <h3>Usamos cookies</h3>
                        <p>
                            Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y personalizar contenido. Lee nuestra{' '}
                            <Link to="/cookies" onClick={() => setVisible(false)}>Política de Cookies</Link>.
                        </p>
                    </div>
                ) : (
                    <div className="cookie-text">
                        <h3>Preferencias de cookies</h3>
                        <p>Puedes configurar qué tipos de cookies quieres permitir. Las cookies necesarias siempre están activas.</p>
                        <div className="cookie-options">
                            <label className="cookie-option disabled">
                                <input type="checkbox" checked readOnly disabled />
                                <span>
                                    <strong>Necesarias</strong>
                                    <em>Funcionamiento básico del sitio. Siempre activas.</em>
                                </span>
                            </label>
                            <label className="cookie-option">
                                <input
                                    type="checkbox"
                                    checked={prefs.analytics}
                                    onChange={(e) => setPrefs(p => ({ ...p, analytics: e.target.checked }))}
                                />
                                <span>
                                    <strong>Analítica</strong>
                                    <em>Métricas de uso y rendimiento (anónimas).</em>
                                </span>
                            </label>
                            <label className="cookie-option">
                                <input
                                    type="checkbox"
                                    checked={prefs.marketing}
                                    onChange={(e) => setPrefs(p => ({ ...p, marketing: e.target.checked }))}
                                />
                                <span>
                                    <strong>Marketing</strong>
                                    <em>Personalización publicitaria y campañas.</em>
                                </span>
                            </label>
                        </div>
                    </div>
                )}

                <div className="cookie-actions">
                    {!showSettings ? (
                        <>
                            <button className="btn btn-outline btn-sm" onClick={() => setShowSettings(true)}>
                                <Settings size={15} /> Configurar
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={acceptAll}>
                                <Check size={15} /> Aceptar
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-outline btn-sm" onClick={rejectAll}>
                                Rechazar opcionales
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={savePrefs}>
                                <Check size={15} /> Guardar preferencias
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CookieBanner;
