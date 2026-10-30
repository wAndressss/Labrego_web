import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ClipboardList, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import './Header.css';

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [logoFailed, setLogoFailed] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeAll = () => {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setDropdownOpen(false);
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const empresaActive = location.pathname === '/empresa' || location.pathname.startsWith('/trabaja-con-nosotros');
    const isActive = (path) =>
        path === '/' ? location.pathname === '/' : location.pathname === path || location.pathname.startsWith(`${path}/`);
    const ariaCurrent = (path) => (isActive(path) ? 'page' : undefined);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container header-container">
                <div className="header-bar">
                    <Link to="/" className="logo-link" aria-label="Labrego — Inicio" onClick={closeAll}>
                        {!logoFailed ? (
                            <img
                                src="/logo-dark.png"
                                alt="Labrego"
                                className="header-logo"
                                onError={() => setLogoFailed(true)}
                            />
                        ) : (
                            <span className="logo-text-fallback">LABREGO</span>
                        )}
                    </Link>

                    <nav className="desktop-nav" aria-label="Principal">
                        <ul className="nav-links">
                            <li>
                                <Link to="/" className={isActive('/') ? 'active' : ''} aria-current={ariaCurrent('/')} onClick={closeAll}>Inicio</Link>
                            </li>
                            <li className="has-dropdown" ref={dropdownRef}>
                                <button
                                    type="button"
                                    className={`dropdown-toggle ${empresaActive ? 'active' : ''}`}
                                    aria-expanded={dropdownOpen}
                                    aria-haspopup="true"
                                    aria-current={empresaActive ? 'page' : undefined}
                                    onClick={() => setDropdownOpen(v => !v)}
                                >
                                    Empresa <ChevronDown size={14} className={`chevron ${dropdownOpen ? 'rotated' : ''}`} />
                                </button>
                                <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`} role="menu">
                                    <Link
                                        to="/empresa"
                                        role="menuitem"
                                        className={isActive('/empresa') ? 'active' : ''}
                                        aria-current={ariaCurrent('/empresa')}
                                        onClick={closeAll}
                                    >
                                        Quiénes Somos
                                    </Link>
                                    <Link
                                        to="/trabaja-con-nosotros"
                                        role="menuitem"
                                        className={isActive('/trabaja-con-nosotros') ? 'active' : ''}
                                        aria-current={ariaCurrent('/trabaja-con-nosotros')}
                                        onClick={closeAll}
                                    >
                                        Trabaja con Nosotros
                                    </Link>
                                    <a
                                        href="https://www.proveedores.labrego.com.co"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        role="menuitem"
                                        onClick={closeAll}
                                    >
                                        Portal Proveedores <ArrowUpRight size={14} />
                                    </a>
                                </div>
                            </li>
                            <li>
                                <Link to="/productos" className={isActive('/productos') ? 'active' : ''} aria-current={ariaCurrent('/productos')} onClick={closeAll}>Productos</Link>
                            </li>
                            <li>
                                <Link to="/contacto" className={isActive('/contacto') ? 'active' : ''} aria-current={ariaCurrent('/contacto')} onClick={closeAll}>Contacto</Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="header-actions">
                        <Link
                            to="/cotizar"
                            className={`header-cta ${isActive('/cotizar') ? 'active' : ''}`}
                            aria-current={ariaCurrent('/cotizar')}
                            onClick={closeAll}
                        >
                            Cotizar
                            <span className="header-cta-arrow" aria-hidden="true"><ArrowRight size={15} /></span>
                        </Link>
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(v => !v)}
                            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`mobile-backdrop ${mobileMenuOpen ? 'visible' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
            />
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav" aria-label="Móvil">
                    <Link to="/" className={isActive('/') ? 'active' : ''} aria-current={ariaCurrent('/')} onClick={closeAll}>Inicio</Link>
                    <div className="mobile-dropdown-section">
                        <span className="mobile-section-title">Empresa</span>
                        <div className="mobile-sublinks">
                            <Link to="/empresa" className={isActive('/empresa') ? 'active' : ''} aria-current={ariaCurrent('/empresa')} onClick={closeAll}>Quiénes Somos</Link>
                            <Link to="/trabaja-con-nosotros" className={isActive('/trabaja-con-nosotros') ? 'active' : ''} aria-current={ariaCurrent('/trabaja-con-nosotros')} onClick={closeAll}>Trabaja con Nosotros</Link>
                        </div>
                    </div>
                    <Link to="/productos" className={isActive('/productos') ? 'active' : ''} aria-current={ariaCurrent('/productos')} onClick={closeAll}>Productos</Link>
                    <Link to="/contacto" className={isActive('/contacto') ? 'active' : ''} aria-current={ariaCurrent('/contacto')} onClick={closeAll}>Contacto</Link>
                    <Link to="/cotizar" className="mobile-cta mobile-cta-quote" onClick={closeAll}>
                        <ClipboardList size={18} /> Cotizar pedido
                    </Link>
                    <a
                        href="https://www.proveedores.labrego.com.co"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mobile-cta"
                        onClick={closeAll}
                    >
                        Portal Proveedores
                    </a>
                </nav>
            </div>
        </header>
    );
}

export default Header;
