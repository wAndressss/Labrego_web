import { useEffect, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

function Counter({ to, suffix = '', duration = 1500 }) {
    const [n, setN] = useState(0);
    const [ref, visible] = useReveal();

    useEffect(() => {
        if (!visible) return;
        const start = performance.now();
        let raf;
        const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(to * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [visible, to, duration]);

    return <span ref={ref}>{n}{suffix}</span>;
}

export default Counter;
