import { useEffect, useRef } from 'react';
import './ScrollProgress.css';

function ScrollProgress() {
    const ref = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const el = ref.current;
        if (!el) return;

        let pending = false;
        const update = () => {
            const doc = document.documentElement;
            const scrollable = doc.scrollHeight - doc.clientHeight;
            const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            el.style.transform = `scaleX(${pct / 100})`;
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

    return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}

export default ScrollProgress;
