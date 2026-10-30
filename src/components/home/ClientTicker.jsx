import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { allies as clients } from '../../data/allies';
import './ClientTicker.css';


// Repeat logos enough times so a single group always exceeds viewport width
const repeatedClients = [...clients, ...clients, ...clients];

function ClientTicker() {
    return (
        <section className="client-ticker-section">
            <div className="container">
                <h3 className="ticker-title">Empresas que confían en nosotros</h3>
            </div>
            <div className="ticker-wrapper">
                <div className="ticker-track">
                    {/* Two identical groups side-by-side for seamless infinite loop */}
                    <div className="ticker-group">
                        {repeatedClients.map((client, index) => (
                            <div key={index} className="ticker-item">
                                <img
                                    src={client.logo}
                                    alt={client.name}
                                    className="client-logo-img"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="ticker-group" aria-hidden="true">
                        {repeatedClients.map((client, index) => (
                            <div key={`dup-${index}`} className="ticker-item">
                                <img
                                    src={client.logo}
                                    alt={client.name}
                                    className="client-logo-img"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="container ticker-foot">
                <Link to="/aliados" className="ticker-link">
                    Conoce a nuestros aliados <ArrowRight size={16} />
                </Link>
            </div>
        </section>
    );
}

export default ClientTicker;

