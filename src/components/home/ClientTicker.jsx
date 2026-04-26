import './ClientTicker.css';

const clients = [
    { name: "Mercamio", logo: "/clientes/mercamio.png" },
    { name: "Supermercados Belalcazar", logo: "/clientes/belarcazar.png" },
    { name: "Nutrium", logo: "/clientes/nutrium.png" },
    { name: "Olímpica", logo: "/clientes/olimpica.png" },
    { name: "La Gran Colombia", logo: "/clientes/la_grab_colombia.png" },
    { name: "Postobón", logo: "/clientes/postobon.png" },
    { name: "Pacífico Snacks", logo: "/clientes/pacifico_snacks.png" },
];

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
        </section>
    );
}

export default ClientTicker;

