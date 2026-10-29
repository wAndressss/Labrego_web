import { useState } from 'react';
import { Leaf } from 'lucide-react';
import './ProductImage.css';

/**
 * Foto de producto con respaldo: si la imagen no existe, muestra un
 * recuadro de marca con el nombre en vez de repetir otra foto.
 */
function ProductImage({ src, alt, name, className = '', loading = 'lazy' }) {
    const [failedSrc, setFailedSrc] = useState(null);

    if (!src || failedSrc === src) {
        return (
            <div className={`product-img-fallback ${className}`} role="img" aria-label={alt || name}>
                <Leaf size={36} strokeWidth={1.4} aria-hidden="true" />
                <span>{name}</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt || name}
            className={className}
            loading={loading}
            onError={() => setFailedSrc(src)}
        />
    );
}

export default ProductImage;
