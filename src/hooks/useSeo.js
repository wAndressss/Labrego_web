import { useEffect } from 'react';

const SITE_URL = 'https://labrego.com';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

function setMeta(attr, key, content) {
    if (!content) return;
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function setLink(rel, href) {
    if (!href) return;
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

export function useSeo({ title, description, path = '/', image = DEFAULT_IMAGE, type = 'website' }) {
    useEffect(() => {
        if (title) document.title = title;
        const url = `${SITE_URL}${path}`;

        setMeta('name', 'description', description);
        setLink('canonical', url);

        setMeta('property', 'og:title', title);
        setMeta('property', 'og:description', description);
        setMeta('property', 'og:url', url);
        setMeta('property', 'og:image', image);
        setMeta('property', 'og:type', type);

        setMeta('name', 'twitter:title', title);
        setMeta('name', 'twitter:description', description);
        setMeta('name', 'twitter:image', image);
    }, [title, description, path, image, type]);
}
