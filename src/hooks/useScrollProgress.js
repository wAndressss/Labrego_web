import { useEffect, useRef, useState } from 'react';

/**
 * Returns ref + 0..1 progress representing how far the element has scrolled
 * across the viewport. 0 = element top hits viewport bottom, 1 = element
 * bottom hits viewport top. Useful for driving section-level transforms.
 */
export function useScrollProgress() {
    const ref = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;

        const el = ref.current;
        if (!el) return;

        let pending = false;

        const update = () => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const total = rect.height + vh;
            const traveled = vh - rect.top;
            const p = Math.max(0, Math.min(1, traveled / total));
            setProgress(p);
            pending = false;
        };

        const onScroll = () => {
            if (pending) return;
            pending = true;
            requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return [ref, progress];
}
