import { ShieldCheck } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import './Legal.css';

function Privacy() {
    useSeo({
        title: 'Política de Tratamiento de Datos — Labrego',
        description: 'Política de Tratamiento de Datos Personales de Labrego conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia.',
        path: '/privacidad',
    });

    return (
        <div className="legal-page">
            <section className="page-header legal-header">
                <div className="container">
                    <span className="hero-eyebrow">
                        <ShieldCheck size={14} /> Compliance
                    </span>
                    <h1 className="page-title">Política de Tratamiento de <span className="gradient-text">Datos Personales</span></h1>
                    <p className="page-subtitle">Conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <article className="legal-content">
                        <div className="legal-meta">
                            <span><strong>Versión</strong>1.0</span>
                            <span><strong>Última actualización</strong>26 de abril de 2026</span>
                            <span><strong>Responsable</strong>Labrego S.A.S.</span>
                        </div>

                        <h2>1. Identificación del Responsable</h2>
                        <p>
                            <strong>Labrego S.A.S.</strong>, identificada con NIT 901.XXX.XXX-X, con domicilio en el municipio de Trujillo, Valle del Cauca, Colombia, es la responsable del tratamiento de los datos personales recolectados a través de este sitio web y sus canales asociados.
                        </p>
                        <p>
                            <strong>Correo de contacto:</strong> <a href="mailto:proteccion.datos@labrego.com">proteccion.datos@labrego.com</a><br />
                            <strong>Teléfono:</strong> +57 (602) 260 1234
                        </p>

                        <h2>2. Definiciones</h2>
                        <ul>
                            <li><strong>Dato personal:</strong> cualquier información vinculada o asociable a una persona natural identificada o identificable.</li>
                            <li><strong>Titular:</strong> persona natural cuyos datos personales son objeto de tratamiento.</li>
                            <li><strong>Tratamiento:</strong> cualquier operación sobre datos personales (recolección, almacenamiento, uso, circulación o supresión).</li>
                            <li><strong>Autorización:</strong> consentimiento previo, expreso e informado del titular para el tratamiento.</li>
                        </ul>

                        <h2>3. Finalidades del Tratamiento</h2>
                        <p>Labrego trata los datos personales para las siguientes finalidades:</p>
                        <ul>
                            <li>Atender solicitudes de cotización, información comercial y servicio al cliente.</li>
                            <li>Gestionar procesos de selección y vinculación laboral.</li>
                            <li>Enviar comunicaciones comerciales, boletines y novedades del sector (previa autorización).</li>
                            <li>Cumplir obligaciones legales, contables y tributarias.</li>
                            <li>Gestionar relaciones con proveedores, productores asociados y clientes.</li>
                            <li>Realizar análisis estadísticos y mejorar la experiencia en nuestro sitio web.</li>
                        </ul>

                        <h2>4. Derechos del Titular</h2>
                        <p>Conforme al artículo 8 de la Ley 1581 de 2012, el titular tiene derecho a:</p>
                        <ul>
                            <li>Conocer, actualizar y rectificar sus datos personales.</li>
                            <li>Solicitar prueba de la autorización otorgada.</li>
                            <li>Ser informado sobre el uso dado a sus datos.</li>
                            <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
                            <li>Revocar la autorización y/o solicitar la supresión de los datos cuando proceda.</li>
                            <li>Acceder de forma gratuita a sus datos personales objeto de tratamiento.</li>
                        </ul>

                        <h2>5. Procedimiento para Ejercer los Derechos</h2>
                        <p>
                            Las consultas, reclamos o solicitudes de supresión deben dirigirse al correo <a href="mailto:proteccion.datos@labrego.com">proteccion.datos@labrego.com</a>, indicando nombre completo, número de identificación, dirección de notificación, descripción de la solicitud y los documentos que se quieran hacer valer.
                        </p>
                        <p>Términos de respuesta:</p>
                        <ul>
                            <li><strong>Consultas:</strong> máximo 10 días hábiles, prorrogables por 5 días más.</li>
                            <li><strong>Reclamos:</strong> máximo 15 días hábiles, prorrogables por 8 días más.</li>
                        </ul>

                        <h2>6. Seguridad de la Información</h2>
                        <p>
                            Labrego adopta medidas técnicas, humanas y administrativas razonables para proteger los datos personales contra adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.
                        </p>

                        <h2>7. Transferencia y Transmisión de Datos</h2>
                        <p>
                            Labrego podrá transferir o transmitir datos a aliados comerciales, proveedores tecnológicos y autoridades cuando lo exija la ley, garantizando los estándares de seguridad y confidencialidad correspondientes.
                        </p>

                        <h2>8. Vigencia</h2>
                        <p>
                            La presente política rige a partir de su publicación. Los datos personales serán conservados durante el tiempo necesario para cumplir las finalidades descritas y las obligaciones legales aplicables.
                        </p>

                        <h2>9. Modificaciones</h2>
                        <p>
                            Labrego se reserva el derecho de modificar esta política en cualquier momento. Los cambios sustanciales serán comunicados a través de este sitio web con al menos 10 días hábiles de anticipación a su entrada en vigencia.
                        </p>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default Privacy;
