import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Leaf } from 'lucide-react';
import ProductImage from './ProductImage';
import './ProductShowcase.css';

const AUTOPLAY_MS = 5000;
const CONFETTI = Array.from({ length: 10 }, (_, i) => i);

/**
 * Carrusel de productos: círculo grande al centro con el producto actual y
 * los vecinos más pequeños a los lados, nombre, frase manuscrita y botón
 * "Ver detalles". Avanza solo cada pocos segundos (se pausa al pasar el
 * cursor o con "reducir movimiento").
 */
function ProductShowcase({ products, index, onIndexChange, onDetails, showThumbs = false }) {
    const [direction, setDirection] = useState('next');
    const [paused, setPaused] = useState(false);
    const count = products.length;
    const at = (i) => products[(i + count) % count];

    const go = useCallback((target, dir) => {
        setDirection(dir);
        onIndexChange((target + count) % count);
    }, [count, onIndexChange]);

    const next = useCallback(() => go(index + 1, 'next'), [go, index]);
    const prev = useCallback(() => go(index - 1, 'prev'), [go, index]);

    useEffect(() => {
        if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const id = setTimeout(next, AUTOPLAY_MS);
        return () => clearTimeout(id);
    }, [paused, next]);

    const onKeyDown = (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };

    const current = at(index);
    const before = at(index - 1);
    const after = at(index + 1);

    return (
        <div
            className="showcase"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onKeyDown={onKeyDown}
            role="region"
            aria-roledescription="carrusel"
            aria-label="Productos"
        >
            {/* La key de cada disco cambia con el producto: así el círculo
                completo se vuelve a montar y repite su animación de entrada */}
            <div className={`showcase-stage slide-${direction}`}>
                <button type="button" className="showcase-circle showcase-side showcase-before" onClick={prev} aria-label={`Anterior: ${before.name}`}>
                    <span className="showcase-disc" key={`b-${before.slug}`}>
                        <span className="showcase-circle-inner">
                            <ProductImage src={before.image} alt="" name={before.name} />
                        </span>
                    </span>
                </button>

                <button
                    type="button"
                    className="showcase-circle showcase-main"
                    onClick={() => onDetails(current)}
                    aria-label={`Ver detalles de ${current.name}`}
                >
                    <span className="showcase-burst" key={`burst-${current.slug}`} aria-hidden="true">
                        <span className="showcase-wave" />
                        <span className="showcase-wave showcase-wave-2" />
                        {CONFETTI.map(i => (
                            <span key={i} className="showcase-confetti" style={{ '--i': i }}>
                                <Leaf size={18 + (i % 3) * 6} strokeWidth={2} fill="currentColor" fillOpacity={0.25} />
                            </span>
                        ))}
                    </span>
                    <span className="showcase-disc" key={`m-${current.slug}`}>
                        <span className="showcase-ring" aria-hidden="true" />
                        <span className="showcase-shine" aria-hidden="true" />
                        <span className="showcase-circle-inner">
                            <ProductImage src={current.image} alt={current.altText} name={current.name} loading="eager" />
                        </span>
                    </span>
                </button>

                <button type="button" className="showcase-circle showcase-side showcase-after" onClick={next} aria-label={`Siguiente: ${after.name}`}>
                    <span className="showcase-disc" key={`a-${after.slug}`}>
                        <span className="showcase-circle-inner">
                            <ProductImage src={after.image} alt="" name={after.name} />
                        </span>
                    </span>
                </button>
            </div>

            <div className="showcase-info" key={`i-${current.slug}`} aria-live="polite">
                <span className="showcase-category">{current.category}</span>
                <h3 className="showcase-name">{current.name}</h3>
                <p className="showcase-tagline script-text">{current.tagline}</p>
                <button type="button" className="showcase-details" onClick={() => onDetails(current)}>
                    Ver detalles
                    <span className="showcase-details-arrow" aria-hidden="true"><ArrowRight size={15} /></span>
                </button>
            </div>

            <div className="showcase-controls">
                <button type="button" className="showcase-arrow" onClick={prev} aria-label="Producto anterior">
                    <ArrowLeft size={18} />
                </button>
                <div className="showcase-dots" role="tablist" aria-label="Elegir producto">
                    {products.map((p, i) => (
                        <button
                            key={p.slug}
                            type="button"
                            role="tab"
                            aria-selected={i === index}
                            aria-label={p.name}
                            className={`showcase-dot ${i === index ? 'active' : ''}`}
                            onClick={() => go(i, i < index ? 'prev' : 'next')}
                        >
                            {i === index && !paused && <span className="showcase-dot-fill" key={`f-${index}`} />}
                        </button>
                    ))}
                </div>
                <button type="button" className="showcase-arrow" onClick={next} aria-label="Producto siguiente">
                    <ArrowRight size={18} />
                </button>
            </div>

            {showThumbs && (
                <div className="showcase-thumbs">
                    {products.map((p, i) => (
                        <button
                            key={p.slug}
                            type="button"
                            className={`showcase-thumb ${i === index ? 'active' : ''}`}
                            onClick={() => go(i, i < index ? 'prev' : 'next')}
                            aria-pressed={i === index}
                        >
                            <span className="showcase-thumb-img">
                                <ProductImage src={p.image} alt="" name={p.name} />
                            </span>
                            <span className="showcase-thumb-name">{p.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductShowcase;
