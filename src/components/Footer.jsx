import { useState } from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';

function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [logoFailed, setLogoFailed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (status === 'loading') return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

        setStatus('loading');
        setTimeout(() => {
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 4000);
        }, 1500);
    };

    const subscribed = status === 'success';
    const loading = status === 'loading';

    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-brand">
                    {!logoFailed ? (
                        <img
                            src="/logo-white.png"
                            alt="Labrego"
                            className="footer-logo-img"
                            onError={() => setLogoFailed(true)}
                        />
                    ) : (
                        <div className="footer-logo">LABREGO</div>
                    )}
                    <p className="footer-desc">
                        Soluciones agropecuarias enfocadas en plátano y banano con los más altos estándares empresariales.
                    </p>
                    <div className="footer-social">
                        <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                        <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                        <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
                    </div>
                </div>

                <div className="footer-links">
                    <h4>Navegación</h4>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/empresa">Empresa</Link></li>
                        <li><Link to="/productos">Productos</Link></li>
                        <li><Link to="/trabaja-con-nosotros">Carreras</Link></li>
                        <li><Link to="/contacto">Contacto</Link></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h4>Contacto</h4>
                    <a href="mailto:labregooficial@labrego.com" className="contact-row"><Mail size={15} />labregooficial@labrego.com</a>
                    <a href="tel:+573001234567" className="contact-row"><Phone size={15} /> +57 313 519 2726</a>
                    <div className="contact-row"><MapPin size={15} /> Trujillo, Valle del Cauca</div>
                </div>

                <div className="footer-newsletter">
                    <h4>Boletín</h4>
                    <p>Recibe noticias y novedades del sector.</p>
                    <form onSubmit={handleSubscribe} className="newsletter-form">
                        <input
                            type="email"
                            placeholder="Tu correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-label="Correo para boletín"
                            disabled={loading}
                            required
                        />
                        <button type="submit" aria-label="Suscribirse" disabled={loading}>
                            {loading ? <Loader2 size={16} className="spin" /> : subscribed ? <CheckCircle size={16} /> : <Send size={16} />}
                        </button>
                    </form>
                    {subscribed && <span className="newsletter-ok">¡Suscripción recibida!</span>}
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Labrego. Todos los derechos reservados.</p>
                <div className="footer-legal">
                    <Link to="/privacidad">Privacidad</Link>
                    <Link to="/terminos">Términos</Link>
                    <Link to="/cookies">Cookies</Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
