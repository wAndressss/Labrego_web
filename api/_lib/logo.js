import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Logo para los PDF que se generan en el servidor
let cached;
export function logoDataUrl() {
    if (cached !== undefined) return cached;
    try {
        cached = `data:image/png;base64,${readFileSync(join(process.cwd(), 'public', 'logo-dark.png')).toString('base64')}`;
    } catch {
        cached = null;
    }
    return cached;
}
