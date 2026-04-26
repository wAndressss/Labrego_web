import { useEffect } from 'react';

/**
 * Inject (or replace) a <script type="application/ld+json"> tag into <head>.
 * Removes the tag on unmount or when `id` / `data` change.
 */
export function useJsonLd(id, data) {
    useEffect(() => {
        if (!id || !data) return;

        let el = document.head.querySelector(`script[data-jsonld="${id}"]`);
        if (!el) {
            el = document.createElement('script');
            el.type = 'application/ld+json';
            el.setAttribute('data-jsonld', id);
            document.head.appendChild(el);
        }
        el.textContent = JSON.stringify(data);

        return () => {
            const existing = document.head.querySelector(`script[data-jsonld="${id}"]`);
            if (existing) existing.remove();
        };
    }, [id, data]);
}
