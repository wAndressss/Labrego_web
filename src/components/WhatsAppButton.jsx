import { useEffect, useState } from 'react';
import { WHATSAPP_PHONE as PHONE } from '../data/contact';
import { WhatsAppIcon } from './icons/BrandIcons';
import './WhatsAppButton.css';

const DEFAULT_MESSAGE = 'Hola Labrego, me gustaría recibir más información sobre sus productos.';

function WhatsAppButton() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setShow(true), 1200);
        return () => clearTimeout(t);
    }, []);

    const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`whatsapp-fab ${show ? 'visible' : ''}`}
            aria-label="Chatear por WhatsApp con Labrego"
            title="Chatear por WhatsApp"
        >
            <span className="whatsapp-pulse" aria-hidden="true" />
            <WhatsAppIcon size={28} />
        </a>
    );
}

export default WhatsAppButton;
