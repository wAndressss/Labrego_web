import { FileText } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import './Legal.css';

function Terms() {
    useSeo({
        title: 'Términos y Condiciones — Labrego',
        description: 'Términos y condiciones de uso del sitio web corporativo de Labrego S.A.S. Lee las condiciones de uso, propiedad intelectual y limitación de responsabilidad.',
        path: '/terminos',
    });

    return (
        <div className="legal-page">
            <section className="page-header legal-header">
                <div className="container">
                    <span className="hero-eyebrow">
                        <FileText size={14} /> Legal
                    </span>
                    <h1 className="page-title">Términos y <span className="gradient-text">Condiciones</span></h1>
                    <p className="page-subtitle">Condiciones de uso del sitio web corporativo de Labrego S.A.S.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <article className="legal-content">
                        <div className="legal-meta">
                            <span><strong>Versión</strong>1.0</span>
                            <span><strong>Última actualización</strong>26 de abril de 2026</span>
                            <span><strong>Jurisdicción</strong>República de Colombia</span>
                        </div>

                        <h2>1. Aceptación</h2>
                        <p>
                            El acceso y uso del sitio web <strong>labrego.com</strong> implica la aceptación expresa de los presentes términos y condiciones. Si no está de acuerdo con alguna disposición, deberá abstenerse de usar el sitio.
                        </p>

                        <h2>2. Identificación del Titular</h2>
                        <p>
                            Este sitio es operado por <strong>Labrego S.A.S.</strong>, sociedad legalmente constituida en Colombia, con domicilio principal en Trujillo, Valle del Cauca.
                        </p>

                        <h2>3. Objeto del Sitio</h2>
                        <p>
                            El sitio web tiene como finalidad presentar información corporativa sobre productos agropecuarios, vacantes laborales y canales de contacto comercial. La información publicada no constituye una oferta vinculante salvo manifestación expresa.
                        </p>

                        <h2>4. Uso Permitido</h2>
                        <p>El usuario se compromete a:</p>
                        <ul>
                            <li>Hacer uso lícito del sitio, conforme a la moral, las buenas costumbres y el orden público.</li>
                            <li>No interferir con la seguridad o el normal funcionamiento del sitio.</li>
                            <li>No utilizar el sitio para fines fraudulentos o que vulneren derechos de terceros.</li>
                            <li>Suministrar información veraz y actualizada en los formularios.</li>
                        </ul>

                        <h2>5. Propiedad Intelectual</h2>
                        <p>
                            Todos los contenidos del sitio (textos, imágenes, logotipos, marcas, diseños, código fuente y software) son propiedad de Labrego S.A.S. o de terceros que han autorizado su uso, y se encuentran protegidos por las leyes colombianas e internacionales de propiedad intelectual.
                        </p>
                        <p>
                            Queda prohibida la reproducción, distribución, comunicación pública o transformación, total o parcial, sin autorización previa y por escrito de Labrego.
                        </p>

                        <h2>6. Productos y Cotizaciones</h2>
                        <p>
                            Las fichas técnicas, especificaciones y precios indicativos son de carácter informativo. La oferta comercial vinculante se formaliza mediante cotización escrita firmada por el área comercial de Labrego.
                        </p>

                        <h2>7. Limitación de Responsabilidad</h2>
                        <p>
                            Labrego no será responsable por daños indirectos, lucro cesante o perjuicios derivados del uso del sitio web, fallas técnicas, interrupciones del servicio o información proporcionada por terceros.
                        </p>

                        <h2>8. Enlaces a Sitios de Terceros</h2>
                        <p>
                            El sitio puede contener enlaces a páginas operadas por terceros. Labrego no controla ni se responsabiliza por el contenido, las políticas o las prácticas de dichos sitios.
                        </p>

                        <h2>9. Protección de Datos</h2>
                        <p>
                            El tratamiento de datos personales se rige por la <a href="/privacidad">Política de Tratamiento de Datos Personales</a> publicada en este sitio.
                        </p>

                        <h2>10. Modificaciones</h2>
                        <p>
                            Labrego podrá modificar estos términos en cualquier momento. Los cambios serán publicados en el sitio y entrarán en vigencia desde su publicación.
                        </p>

                        <h2>11. Ley Aplicable y Jurisdicción</h2>
                        <p>
                            Los presentes términos se rigen por las leyes de la República de Colombia. Cualquier controversia será resuelta ante los jueces competentes del Circuito de Tuluá, Valle del Cauca, salvo pacto en contrario.
                        </p>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default Terms;
