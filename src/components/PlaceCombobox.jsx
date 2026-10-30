import { useId, useMemo, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { VALLE_PLACES } from '../data/valleDelCauca';
import './PlaceCombobox.css';

// Compara sin tildes ni mayúsculas: "tulua" encuentra "Tuluá"
const normalize = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Campo de texto con sugerencias de lugares del Valle del Cauca.
 * Se puede elegir de la lista o escribir cualquier otro lugar.
 */
function PlaceCombobox({ id, value, onChange, invalid, placeholder }) {
    const listId = useId();
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const listRef = useRef(null);

    const options = useMemo(() => {
        const q = normalize(value.trim());
        if (!q) return VALLE_PLACES;
        const starts = VALLE_PLACES.filter(p => normalize(p.label).startsWith(q));
        const contains = VALLE_PLACES.filter(p => !normalize(p.label).startsWith(q) && normalize(p.label).includes(q));
        return [...starts, ...contains];
    }, [value]);

    const choose = (place) => {
        onChange(`${place.label}, Valle del Cauca`);
        setOpen(false);
        setActive(-1);
    };

    const scrollTo = (index) => {
        listRef.current?.children[index]?.scrollIntoView({ block: 'nearest' });
    };

    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            const next = Math.min(active + 1, options.length - 1);
            setActive(next);
            scrollTo(next);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const next = Math.max(active - 1, 0);
            setActive(next);
            scrollTo(next);
        } else if (e.key === 'Enter' && open && active >= 0 && options[active]) {
            e.preventDefault();
            choose(options[active]);
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    return (
        <div className="place-combo">
            <MapPin size={18} className="place-combo-icon" aria-hidden="true" />
            <input
                id={id}
                type="text"
                className={`form-control place-combo-input ${invalid ? 'error' : ''}`}
                value={value}
                placeholder={placeholder}
                autoComplete="off"
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
                onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(-1); }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 120)}
                onKeyDown={onKeyDown}
            />
            {open && (
                <ul className="place-combo-list" id={listId} role="listbox" ref={listRef}>
                    {options.length === 0 ? (
                        <li className="place-combo-empty">
                            No está en la lista. Puedes dejarlo escrito así.
                        </li>
                    ) : options.map((place, i) => (
                        <li
                            key={place.label}
                            id={`${listId}-${i}`}
                            role="option"
                            aria-selected={i === active}
                            className={i === active ? 'active' : ''}
                            onMouseDown={(e) => { e.preventDefault(); choose(place); }}
                            onMouseEnter={() => setActive(i)}
                        >
                            <span>{place.label}</span>
                            <small>{place.detail}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PlaceCombobox;
