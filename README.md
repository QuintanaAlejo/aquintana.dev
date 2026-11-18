# aquintana.dev

Portfolio personal de Alejo Quintana, en español (`/`) y en inglés (`/en`).

**Stack:** Next.js (App Router) + React + Tailwind CSS, desplegado en Vercel. Sin backend propio: el formulario de contacto usa [Web3Forms](https://web3forms.com).

## Desarrollo

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # build de producción
pnpm lint
```

El formulario usa la access key pública del form "Portfolio form" de Web3Forms (`src/lib/site.ts`). Se puede pisar con la variable `NEXT_PUBLIC_WEB3FORMS_KEY` (en `.env.local` o en Vercel).

## Contenido

- **Textos:** `src/content/es.ts` y `src/content/en.ts` (misma estructura, tipada en `types.ts`).
- **Fotos:** `src/assets/fotos/retrato.jpg` (portada) y `src/assets/fotos/charla.jpg` (formación). Para cambiarlas, reemplazá el archivo por otro con el mismo nombre y volvé a desplegar.
- **CV:** `public/cv/Alejo-Quintana-CV.pdf`. Mismo criterio: reemplazar el archivo y desplegar.
- **Capturas de proyectos y logos:** `src/assets/proyectos/` y `src/assets/logos/`.

## Sistema de diseño

Gris monocromo con grano, vidrio y formas redondeadas, con un único acento naranja `#F0531C` reservado para detalles (nunca como color de texto).

- **Tipografía:** Geist Mono 600 para títulos y etiquetas, Geist 400/500 para el cuerpo.
- **Color:** tokens en `src/app/globals.css`. Modo claro y oscuro con paletas propias; el modo sigue al sistema y se puede cambiar desde la navegación.
- **Radios:** 18 (campos), 28 (imágenes), 40 (tarjetas), cápsula (botones y navegación).
- **Movimiento:** título que se escribe solo, secciones que aparecen al entrar en pantalla, cinta de tecnologías y la foto de portada que sube a la navegación y se vuelve el monograma "AQ". Todo se desactiva con `prefers-reduced-motion`.
