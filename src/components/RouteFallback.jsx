import './RouteFallback.css';

function RouteFallback() {
    return (
        <div className="route-fallback" role="status" aria-live="polite">
            <div className="route-fallback-spinner" aria-hidden="true">
                <span />
                <span />
                <span />
            </div>
            <span className="visually-hidden">Cargando…</span>
        </div>
    );
}

export default RouteFallback;
