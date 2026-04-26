import { useEffect, useRef } from 'react';

/**
 * 3D tilt + pointer-tracked highlight on hover.
 * Sets CSS vars: --tilt-x, --tilt-y, --mx, --my (0..1).
 */
export function useMouseTilt(strength = 8) {
    const ref = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const el = ref.current;
        if (!el) return;

        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltY = (x - 0.5) * strength;
            const tiltX = (0.5 - y) * strength;
            el.style.setProperty('--tilt-x', `${tiltX}deg`);
            el.style.setProperty('--tilt-y', `${tiltY}deg`);
            el.style.setProperty('--mx', x.toFixed(3));
            el.style.setProperty('--my', y.toFixed(3));
        };
        const onLeave = () => {
            el.style.setProperty('--tilt-x', '0deg');
            el.style.setProperty('--tilt-y', '0deg');
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
        };
    }, [strength]);

    return ref;
}
