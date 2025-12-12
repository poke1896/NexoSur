# NexoSur — Arquitectura y Guía de Integración con Base de Datos (Firebase)

Este documento explica la funcionalidad actual del proyecto, los puntos de integración para conectar una base de datos (propuesta: Firebase), y los pasos recomendados para migrar del almacenamiento temporal a persistencia real.

## Visión General

- Framework: Next.js (App Router) + React + Tailwind CSS.
- Idiomas: i18n simple (ES/EN) con `t()` para UI y `lx()` para textos de datos.
- Autenticación provisional: contexto en cliente + cookies simples para guardias SSR (demo).
- Datos: mezcla de datos base estáticos con "overrides" en JSON (runtime) para simular CRUD.
- Analítica: contador de visitas (artesanos y productos) persistido en JSON.

## Módulos Clave y Responsabilidades

- i18n
  - Proveedor/Hook: [i18n/I18nProvider.js](../i18n/I18nProvider.js)
  - `t(key)`: textos de interfaz. `lx(obj, baseKey)`: devuelve campo localizado (`campo` o `campo_en`).

- Autenticación
  - Cliente: [auth/AuthProvider.js](../auth/AuthProvider.js) — maneja `user`, `login()`, `logout()`, cookies de demo (`nexosur_auth`, `nexosur_user`).
  - SSR helper: [lib/auth-server.js](../lib/auth-server.js) — lee `nexosur_user` para proteger rutas de servidor.
  - Guardias SSR:
    - Producto: [app/artisans/[slug]/products/[productId]/page.js](../app/artisans/%5Bslug%5D/products/%5BproductId%5D/page.js)
    - Dashboard: [app/dashboard/page.js](../app/dashboard/page.js)

- Datos (Base + Runtime)
  - Base estática: [data/artisans.js](../data/artisans.js) — catálogo semilla (ES/EN, productos y WhatsApp).
  - Runtime/Overrides: [lib/runtimeData.js](../lib/runtimeData.js) — fusiona base con overrides persistidos en JSON.
  - Persistencia JSON: [lib/store.js](../lib/store.js) — utilidades de lectura/escritura en `data/store/*.json`.

- Analítica
  - API de visitas: [app/api/analytics/visit/route.js](../app/api/analytics/visit/route.js)
  - API de stats: [app/api/analytics/stats/route.js](../app/api/analytics/stats/route.js)
  - Lógica: [lib/analytics.js](../lib/analytics.js)
  - Disparos en UI:
    - Detalle artesano: [components/ArtisanDetailClient.js](../components/ArtisanDetailClient.js)
    - Detalle producto: [components/ProductDetailClient.js](../components/ProductDetailClient.js)

- APIs públicas (lectura)
  - Lista artesanos fusionados: [app/api/public/artisans/route.js](../app/api/public/artisans/route.js)
  - Un artesano fusionado: [app/api/public/artisans/[slug]/route.js](../app/api/public/artisans/%5Bslug%5D/route.js)

- Dashboard (CRUD de productos)
  - Página (SSR + cliente): [app/dashboard/page.js](../app/dashboard/page.js) + [components/dashboard/DashboardClient.js](../components/dashboard/DashboardClient.js)
  - API protegida: [app/api/dashboard/products/route.js](../app/api/dashboard/products/route.js)
    - Modo demo: acepta `?slug=` en query y no exige cookie.
    - Producción: eliminar el fallback de query y requerir sesión (Session Cookie) + `ownerUserId`.
  - Acceso desde el detalle del artesano: botones "Monitorear este emprendimiento" y "Administrar productos" que navegan a `/dashboard?slug={slug}`. En modo demo se muestran a cualquier usuario; en producción se debe validar que `uid`/`artisanSlug` correspondan al dueño.

## Qué migrar al conectar Firebase

1) Autenticación real
   - Reemplazar la lógica de `AuthProvider` (cookies de demo) por Firebase Auth:
     - Cliente: iniciar sesión (email/contraseña, Google, etc.) con el SDK de Firebase.
     - Servidor: intercambiar el ID Token por una Session Cookie (Firebase Admin SDK) en un endpoint (`/api/auth/session`) y setear cookies HTTPOnly.
     - Guardias SSR: validar la sesión con Admin SDK en componentes de servidor y rutas API.

2) Datos (artesanos y productos)
   - Reemplazar `runtimeData`/`store` por consultas a Firestore (o Realtime DB):
     - Lectura pública:
       - `/api/public/artisans`: `artisans` + subcolecciones o agregados.
       - `/api/public/artisans/[slug]`: documento único + subcolección `products`.
     - Dashboard (CRUD):
       - `/api/dashboard/products` deberá usar el `uid` de la sesión para autorizar contra `ownerUserId` del `artisan`.

3) Analítica de visitas
   - Reemplazar incrementos en JSON por `FieldValue.increment(1)` en Firestore.
   - Opcional: usar Cloud Functions para consolidar counters y/o BigQuery para análisis.

## Propuesta de Esquema (Firestore)

- Colección `users`
  - `users/{uid}`: { displayName, email, role: 'artisan'|'user', artisanSlug?: string }

- Colección `artisans`
  - `artisans/{slug}`: {
      slug, ownerUserId (uid),
      name, name_en, shortDescription, shortDescription_en,
      description, description_en, image, whatsapp,
      visits (counter)
    }
  - Subcolección `products`
    - `artisans/{slug}/products/{productId}`: {
        title, title_en, description, description_en,
        price (number), image, visits (counter)
      }

- Colección `analytics` (opcional si no se usan counters embebidos)
  - `analytics/artisanVisits/{slug}`: { count }
  - `analytics/productVisits/{slug}_{productId}`: { count }

## Puntos de Código a Sustituir

- Autenticación
  - Cliente: [auth/AuthProvider.js](../auth/AuthProvider.js)
    - Hoy: crea cookies simples. Mañana: usar Firebase Auth; llamar a un endpoint para setear Session Cookie HTTPOnly.
  - Servidor: [lib/auth-server.js](../lib/auth-server.js)
    - Hoy: lee cookie base64. Mañana: verificar Session Cookie con Admin SDK (decodificar y obtener `uid`).
  - Guardias SSR: actualizar en [app/dashboard/page.js](../app/dashboard/page.js) y [app/artisans/[slug]/products/[productId]/page.js](../app/artisans/%5Bslug%5D/products/%5BproductId%5D/page.js) para validar `uid`.

- Datos públicos
  - [app/api/public/artisans/route.js](../app/api/public/artisans/route.js)
  - [app/api/public/artisans/[slug]/route.js](../app/api/public/artisans/%5Bslug%5D/route.js)
  - Sustituir `getMergedArtisans/getMergedArtisan` por lecturas a Firestore.

- Dashboard CRUD
  - [app/api/dashboard/products/route.js](../app/api/dashboard/products/route.js)
  - Sustituir `upsertProduct/deleteProduct` por escrituras en `artisans/{slug}/products/*`.
  - Autorizar con `uid` = `ownerUserId` del artesano.

- Analítica
  - [app/api/analytics/visit/route.js](../app/api/analytics/visit/route.js)
  - [app/api/analytics/stats/route.js](../app/api/analytics/stats/route.js)
  - Reemplazar `increment*` y `getArtisanStats` por consultas y/o acumuladores en Firestore.

## Pasos Recomendados de Integración (Firebase)

1) Configuración
   - Crear proyecto Firebase (Web App).
   - Variables de entorno en `.env.local`:
     - Cliente: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, etc.
     - Servidor (Admin): `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (con \n escapados si aplica).

2) SDKs
   - Cliente: instalar `firebase` y crear `lib/firebase-client.ts/js` para `initializeApp` y `getAuth()`.
   - Servidor: instalar `firebase-admin` y crear `lib/firebase-admin.ts/js` con `initializeApp({ credential })`.

3) Sesiones
   - Crear endpoint `/api/auth/session`:
     - Recibe `idToken` (cliente) y genera Session Cookie con Admin SDK (`createSessionCookie`).
     - Setea cookie HTTPOnly `session` y devuelve 200.
   - `/api/auth/logout`: borra la cookie `session`.
   - Actualizar `AuthProvider` para:
     - Iniciar sesión con Firebase Auth (cliente) y llamar a `/api/auth/session`.
     - Cerrar sesión: llamar `/api/auth/logout` y `signOut()`.

4) Datos
   - Migrar lectura pública a Firestore (rutas en `app/api/public/...`).
   - Migrar CRUD del dashboard a Firestore (rutas en `app/api/dashboard/...`).
   - Añadir `ownerUserId` a `artisans` y validar en APIs que `uid` coincida con el propietario.

5) Analítica
   - Reemplazar incrementos por `FieldValue.increment(1)`.
   - Opcional: Cloud Functions para agregados/Top y programar resúmenes.

## i18n y DB

Para mantener bilingüe sin complicaciones:
  - Guardar campos dobles por documento: `name`/`name_en`, `description`/`description_en`, `title`/`title_en`, etc.
  - La UI ya usa `lx(obj, 'campo')` — si existe `campo_en` y el idioma es EN, lo toma automáticamente.

## Seguridad y Roles

- Usuarios compradores: `role = 'user'`.
- Artesanos: `role = 'artisan'`, `artisanSlug` asignado.
- En el servidor validar:
  - La Session Cookie (Firebase Admin) → obtener `uid`.
  - Cargar `users/{uid}` → verificar `role` y `artisanSlug`.
  - En APIs de dashboard, permitir sólo operaciones sobre `artisans/{artisanSlug}` cuyo `ownerUserId === uid`.

## Lista de Verificación al Integrar

- [ ] Variables de entorno y SDKs inicializados.
- [ ] Endpoints de sesión (login/logout) implementados.
- [ ] Guardias SSR migrados a Session Cookie de Firebase.
- [ ] APIs públicas leen de Firestore.
- [ ] APIs de dashboard leen/escriben en Firestore con autorización.
- [ ] Analítica migra a counters de Firestore o CF.
- [ ] Campos bilingües guardados y consumidos vía `lx()`.

## Referencias Internas (Rutas y Componentes)

- Home (lista artesanos): [app/page.js](../app/page.js)
- Detalle artesano: [app/artisans/[slug]/page.js](../app/artisans/%5Bslug%5D/page.js)
- Detalle producto (guard SSR): [app/artisans/[slug]/products/[productId]/page.js](../app/artisans/%5Bslug%5D/products/%5BproductId%5D/page.js)
- Dashboard (SSR + cliente): [app/dashboard/page.js](../app/dashboard/page.js) + [components/dashboard/DashboardClient.js](../components/dashboard/DashboardClient.js)
- APIs: ver carpeta [app/api](../app/api)

---

Si prefieres otra base (Postgres/Prisma, Supabase), el mapeo es similar: sustituir `lib/runtimeData.js`, `lib/analytics.js` y las rutas API por consultas SQL, mantener guardias SSR con la sesión de tu proveedor.
