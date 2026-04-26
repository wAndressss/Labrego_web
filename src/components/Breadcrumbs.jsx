import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import './Breadcrumbs.css';

/**
 * items: [{ label, to? }] — last item has no `to` (current page)
 */
function Breadcrumbs({ items = [], showHome = true, className = '' }) {
    const trail = showHome ? [{ label: 'Inicio', to: '/' }, ...items] : items;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.label,
            ...(item.to ? { item: `${window.location.origin}${item.to}` } : {}),
        })),
    };

    return (
        <nav className={`breadcrumbs ${className}`} aria-label="Breadcrumb">
            <ol>
                {trail.map((item, i) => {
                    const isLast = i === trail.length - 1;
                    return (
                        <li key={`${item.label}-${i}`} className={isLast ? 'current' : ''}>
                            {i === 0 && showHome ? (
                                isLast ? (
                                    <span aria-current="page"><Home size={13} /> {item.label}</span>
                                ) : (
                                    <Link to={item.to}><Home size={13} /> {item.label}</Link>
                                )
                            ) : isLast ? (
                                <span aria-current="page">{item.label}</span>
                            ) : (
                                <Link to={item.to}>{item.label}</Link>
                            )}
                            {!isLast && <ChevronRight size={13} className="bc-sep" aria-hidden="true" />}
                        </li>
                    );
                })}
            </ol>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </nav>
    );
}

export default Breadcrumbs;
