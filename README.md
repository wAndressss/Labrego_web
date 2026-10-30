# Labrego — página web

## Ver la página en tu computador (Windows)

Haz **doble clic en `iniciar-web.bat`** (en la carpeta del proyecto). El archivo:

1. Baja los últimos cambios de GitHub.
2. Instala lo necesario.
3. Abre la página en el navegador (http://localhost:5173).

Deja abierta la ventana negra mientras usas la página. Cada vez que quieras ver
cambios nuevos, cierra esa ventana y vuelve a hacer doble clic en `iniciar-web.bat`.

Requisitos (una sola vez): [Node.js LTS](https://nodejs.org) y [Git](https://git-scm.com).

## Cotizaciones por correo

Cuando un cliente cotiza en `/cotizar`:

1. La página calcula los precios (`src/data/products.js`, campo `price`, en COP por kilo).
2. `api/quote.js` genera el PDF y lo envía al correo del cliente con un botón **Confirmar pedido**.
3. El botón abre `/confirmar`, donde el cliente revisa y confirma.
4. `api/confirm.js` envía la **orden de venta** en PDF a `ORDERS_EMAIL` y un aviso al cliente.

El enlace de confirmación va firmado con `QUOTE_SECRET`, así que no se puede alterar.
No se usa base de datos.

### Configuración (una sola vez)

1. En la cuenta de Google de `labregooficial@gmail.com`, activa la **verificación en 2 pasos**
   y crea una **contraseña de aplicación** en https://myaccount.google.com/apppasswords
2. Copia `.env.example` como `.env.local` y llena `SMTP_PASS` (la contraseña de aplicación)
   y `QUOTE_SECRET` (una frase larga inventada). `.env.local` no se sube a GitHub.
3. En producción (Vercel), crea las mismas variables en
   *Project → Settings → Environment Variables* y pon `SITE_URL` con la dirección pública.

Sin esta configuración, el formulario muestra un aviso y ofrece descargar el PDF o enviarlo por WhatsApp.

Para cambiar precios, edita `price` en `src/data/products.js` (`null` = a convenir).

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
