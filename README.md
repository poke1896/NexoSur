# NexoSur

Marketplace para artesanos y microempresas de la Zona Sur de Costa Rica. Proyecto construido con Next.js y Tailwind CSS, con diseño móvil-first.

## Requisitos

- Node.js 18+ y npm

## Instalar y ejecutar

```bash
npm install
npm run dev
```

La app corre en http://localhost:3000

## Estructura

- `app/`: Rutas (Home y artesanos dinámicos) y layout global.
- `components/`: Componentes reutilizables (`ArtisanCard`, `ProductCard`).
- `data/`: Datos mock de artesanos y productos.
- `tailwind.config.js`: Configuración de Tailwind.

## Próximos pasos sugeridos

- Autenticación para comerciantes y panel para subir productos.
- Búsqueda y filtros por categoría o ubicación.
- Carrito/pedidos o integración con WhatsApp para pedidos.
- Reemplazar imágenes de Unsplash por CDN propio.

## Documentación de arquitectura e integración

- Ver docs/ARQUITECTURA_E_INTEGRACION_FIREBASE.md para detalles de módulos, APIs y cómo conectar Firebase (Auth, Firestore y analítica).