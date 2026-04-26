import { Cookie } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import './Legal.css';

function Cookies() {
    useSeo({
        title: 'Política de Cookies — Labrego',
        description: 'Información sobre cómo Labrego utiliza cookies y tecnologías similares en su sitio web. Tipos de cookies, finalidad y opciones de configuración.',
        path: '/cookies',
    });

    return (
        <div className="legal-page">
            <section className="page-header legal-header">
                <div className="container">
                    <span className="hero-eyebrow">
                        <Cookie size={14} /> Privacidad
                    </span>
                    <h1 className="page-title">Política de <span className="gradient-text">Cookies</span></h1>
                    <p className="page-subtitle">Cómo utilizamos cookies y tecnologías similares en este sitio.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <article className="legal-content">
                        <div className="legal-meta">
                            <span><strong>Versión</strong>1.0</span>
                            <span><strong>Última actualización</strong>26 de abril de 2026</span>
                        </div>

                        <h2>1. ¿Qué son las cookies?</h2>
                        <p>
                            Las cookies son pequeños archivos de texto que los sitios web colocan en el dispositivo del usuario al navegar por ellos. Permiten recordar información sobre la visita, mejorar la experiencia y obtener estadísticas de uso.
                        </p>

                        <h2>2. Tipos de cookies que utilizamos</h2>

                        <h3>Cookies estrictamente necesarias</h3>
                        <p>
                            Permiten el funcionamiento básico del sitio (navegación, sesiones, preferencias de banner de cookies). No requieren consentimiento previo.
                        </p>

                        <h3>Cookies de rendimiento y analítica</h3>
                        <p>
                            Recopilan información agregada y anónima sobre el uso del sitio para entender cómo interactúan los visitantes y mejorar la plataforma. Pueden incluir herramientas como Google Analytics.
                        </p>

                        <h3>Cookies de funcionalidad</h3>
                        <p>
                            Recuerdan preferencias del usuario para personalizar la experiencia (idioma, visualización, contenido relevante).
                        </p>

                        <h3>Cookies de marketing</h3>
                        <p>
                            Permiten mostrar publicidad relevante y medir la eficacia de campañas. Solo se activan con consentimiento expreso del usuario.
                        </p>

                        <h2>3. Finalidad</h2>
                        <ul>
                            <li>Garantizar el funcionamiento técnico del sitio.</li>
                            <li>Recordar preferencias y consentimientos.</li>
                            <li>Obtener métricas de uso, navegación y rendimiento.</li>
                            <li>Mejorar la experiencia de usuario y la oferta comercial.</li>
                        </ul>

                        <h2>4. Gestión y desactivación</h2>
                        <p>
                            El usuario puede aceptar o configurar el uso de cookies a través del banner mostrado al ingresar al sitio. Adicionalmente, la mayoría de los navegadores permiten bloquear o eliminar cookies desde sus opciones de configuración.
                        </p>
                        <ul>
                            <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos del sitio.</li>
                            <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio.</li>
                            <li><strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos del sitio web.</li>
                            <li><strong>Edge:</strong> Configuración → Cookies y permisos del sitio.</li>
                        </ul>
                        <p>
                            Tenga en cuenta que la desactivación de ciertas cookies puede afectar la funcionalidad del sitio.
                        </p>

                        <h2>5. Cookies de terceros</h2>
                        <p>
                            Algunas cookies pueden ser instaladas por servicios de terceros (Google, plataformas de redes sociales, herramientas de marketing). Estas se rigen por las políticas de privacidad de los respectivos proveedores.
                        </p>

                        <h2>6. Cambios en la política</h2>
                        <p>
                            Labrego podrá actualizar esta política para reflejar cambios legales, técnicos u operativos. La fecha de "última actualización" indicará la versión vigente.
                        </p>

                        <h2>7. Más información</h2>
                        <p>
                            Para consultas relacionadas con esta política, escriba a <a href="mailto:proteccion.datos@labrego.com">proteccion.datos@labrego.com</a> o consulte nuestra <a href="/privacidad">Política de Tratamiento de Datos Personales</a>.
                        </p>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default Cookies;
