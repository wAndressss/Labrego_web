import { useEffect, useRef, useState } from 'react';

export function useReveal(threshold = 0.18) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                obs.disconnect();
            }
        }, { threshold });
        obs.observe(node);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
}
