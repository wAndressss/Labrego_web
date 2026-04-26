import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Sprout } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import './NotFound.css';

function NotFound() {
    useSeo({
        title: 'Página no encontrada — Labrego',
        description: 'La página que buscas no existe o fue movida. Vuelve al inicio o explora nuestras secciones principales.',
        path: '/404',
    });

    return (
        <div className="notfound-page">
            <section className="notfound-hero">
                <div className="container notfound-content">
                    <div className="notfound-badge">
                        <Sprout size={14} /> Error 404
                    </div>

                    <div className="notfound-code" aria-hidden="true">
                        <span>4</span>
                        <span className="notfound-zero">
                            <Sprout size={64} strokeWidth={1.5} />
                        </span>
                        <span>4</span>
                    </div>

                    <h1 className="notfound-title">
                        Esta página no <span className="gradient-text">echó raíz</span>
                    </h1>
                    <p className="notfound-subtitle">
                        No pudimos encontrar la página que buscas. Es posible que haya sido movida, renombrada o que ya no esté disponible.
                    </p>

                    <div className="notfound-actions">
                        <Link to="/" className="btn btn-primary btn-lg">
                            <Home size={18} /> Volver al inicio
                        </Link>
                        <button onClick={() => window.history.back()} className="btn btn-outline btn-lg">
                            <ArrowLeft size={18} /> Página anterior
                        </button>
                    </div>

                    <div className="notfound-suggest">
                        <p>O explora directamente:</p>
                        <div className="notfound-links">
                            <Link to="/empresa">Empresa</Link>
                            <Link to="/productos">Productos</Link>
                            <Link to="/trabaja-con-nosotros">Carreras</Link>
                            <Link to="/contacto">Contacto</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default NotFound;
