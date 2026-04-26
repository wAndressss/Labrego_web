import { useEffect, useState } from 'react';
import './WhatsAppButton.css';

const PHONE = '573001234567'; // sin +, formato internacional
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
            <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
                <path d="M19.11 17.5c-.27-.13-1.59-.78-1.83-.87-.25-.09-.43-.13-.6.13-.18.27-.7.87-.85 1.05-.16.18-.31.2-.58.07a7.51 7.51 0 0 1-2.21-1.36 8.27 8.27 0 0 1-1.53-1.9c-.16-.27-.02-.42.12-.55.12-.12.27-.31.4-.46.14-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.6-1.45-.83-1.99-.22-.52-.44-.45-.6-.46-.16 0-.34-.02-.52-.02s-.47.07-.72.34c-.25.27-.94.92-.94 2.24 0 1.32.96 2.6 1.1 2.78.13.18 1.9 2.91 4.61 4.07.64.28 1.15.44 1.54.57.65.21 1.24.18 1.71.11.52-.08 1.59-.65 1.81-1.27.22-.62.22-1.16.16-1.27-.07-.12-.25-.18-.52-.31zM16.02 5.33C10.13 5.33 5.33 10.12 5.33 16c0 1.88.49 3.7 1.43 5.32L5.33 26.67l5.5-1.43A10.65 10.65 0 0 0 16.02 26.67c5.88 0 10.68-4.79 10.68-10.67S21.91 5.33 16.02 5.33zm0 19.55a8.85 8.85 0 0 1-4.5-1.23l-.32-.19-3.27.85.87-3.18-.21-.33a8.85 8.85 0 0 1 13.55-11.16 8.78 8.78 0 0 1 2.6 6.27c0 4.89-3.99 8.87-8.72 8.87z" />
            </svg>
        </a>
    );
}

export default WhatsAppButton;
