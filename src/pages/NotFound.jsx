import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import './NotFound.css';

function NotFound() {
    useSeo({
        title: 'Página no encontrada — Labrego',
        description: 'La página que buscas no existe o fue movida. Vuelve al inicio o explora nuestras secciones principales.',
        path: '/404',
    });

    return (
        <main className="nf-page">
            <div className="nf-inner">
                <span className="nf-tag">404</span>
                <h1 className="nf-title">Página no encontrada</h1>
                <p className="nf-lead">
                    La página que buscas no existe o fue movida.
                </p>

                <div className="nf-actions">
                    <Link to="/" className="nf-btn nf-btn-primary">
                        Volver al inicio
                        <ArrowRight size={16} />
                    </Link>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="nf-btn nf-btn-ghost"
                    >
                        <ArrowLeft size={16} />
                        Atrás
                    </button>
                </div>

                <div className="nf-links">
                    <Link to="/empresa">Empresa</Link>
                    <span aria-hidden="true">·</span>
                    <Link to="/productos">Productos</Link>
                    <span aria-hidden="true">·</span>
                    <Link to="/contacto">Contacto</Link>
                </div>
            </div>
        </main>
    );
}

export default NotFound;
