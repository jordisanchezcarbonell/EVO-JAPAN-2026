# ES @ EVO Japan 2026

App Next.js 15 (App Router) que lista todos los jugadores con país **Spain** en su perfil de
start.gg participando en EVO Japan 2026, agrupados por evento.

## Requisitos

- **Node.js 22 LTS o superior** (el `.nvmrc` fija `24.15.0`, la Active LTS actual).
- npm 10+ (viene con Node 22/24).
- Token de developer de start.gg → https://www.start.gg/admin/profile/developer

## Setup

```bash
# 1. Asegurar la versión de Node
nvm install   # lee .nvmrc → instala 24.15.0
nvm use       # activa esa versión en la shell actual

# 2. Instalar dependencias
npm install   # o pnpm / yarn

# 3. Configurar token
cp .env.local.example .env.local
# Edita .env.local y pega tu token

# 4. Arrancar en dev
npm run dev
```

Abre http://localhost:3000.

> Si usas **asdf** o **mise** en lugar de nvm, el `.tool-versions` también está incluido.

## Cómo funciona

- `lib/startgg.ts` — Cliente GraphQL server-only. Pagina los ~80 lotes de attendees en paralelo
  (lotes de 5 para no chocar con el rate limit ~80 req/min de start.gg). Filtra por `country` y
  deduplica.
- `app/page.tsx` — Server Component. Llama a `getSpanishPlayers()`. Cachea con
  `revalidate = 3600` (1 hora).
- `app/api/spanish-players/route.ts` — Mismo dato expuesto como JSON endpoint
  (`/api/spanish-players`).
- `components/PlayerList.tsx` — Client component con filtro por juego y búsqueda libre.

El token **nunca** se envía al navegador: solo vive en el process del servidor de Next.

## Despliegue

Funciona out-of-the-box en Vercel. Define `STARTGG_TOKEN` como variable de entorno del proyecto.
La caché de `fetch()` con `revalidate` se respeta tanto en dev como en producción.

En Vercel, configura la versión de Node en **Project Settings → General → Node.js Version**
(elige `24.x` o `22.x`).

## Caveats

- Solo aparecen jugadores que tengan `Spain` marcado en su perfil de start.gg. Si alguien no
  rellenó el país no es detectable por API — revisa manualmente en la pestaña *Attendees* del
  torneo si echas de menos a alguien.
- La primera carga (caché frío) tarda ~30–60s porque hay que recorrer 80+ páginas. Después de
  eso, instantáneo durante 1h.
