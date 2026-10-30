import { useEffect, useRef } from 'react';

/**
 * Lightweight parallax via rAF + transform3d.
 * Returns a ref to attach to the element. Element will translate Y at `speed * (scroll past its section's top)`.
 *
 * speed: 0..1 (recommended 0.05–0.35). Negative values reverse direction.
 * scale: optional zoom factor over scroll depth (e.g. 0.0008 → +0.4 over 500px).
 */
export function useParallax(speed = 0.2, { scale = 0, max = Infinity } = {}) {
    const ref = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const el = ref.current;
        if (!el) return;

        let rafId = 0;
        let pending = false;

        const update = () => {
            // Se mide respecto a la sección que contiene la imagen, no al
            // scroll total: así funciona igual en el hero y más abajo
            const top = (el.parentElement || el).getBoundingClientRect().top;
            const y = -top;
            const offset = Math.max(-max, Math.min(y * speed, max));
            const z = scale ? 1 + Math.min(Math.max(y, 0) * scale, 0.6) : 1;
            el.style.transform = `translate3d(0, ${offset}px, 0) scale(${z})`;
            pending = false;
        };

        const onScroll = () => {
            if (pending) return;
            pending = true;
            rafId = requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rafId);
        };
    }, [speed, scale, max]);

    return ref;
}
