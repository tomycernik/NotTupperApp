# NotTupper App

Frontend Angular para venta de viandas caseras freezadas.

## Objetivo

Permitir que el cliente vea el menú semanal, seleccione packs de viandas/extras y arme un mensaje de WhatsApp para confirmar el pedido.

## Scripts

npm install
npm start
npm run build

## URLs locales

App: http://localhost:4200
API: http://localhost:3000/api

## Flujo de pedido

1. El cliente entra al menú.
2. Selecciona viandas 300g o 500g.
3. Puede sumar extras.
4. Agrega observaciones.
5. Toca “Armar mensaje de WhatsApp”.
6. El pedido se confirma al enviar el mensaje.

No hace falta iniciar sesión para pedir por WhatsApp.
El login queda para historial, usuario y admin.

## Configuración

La URL de la API se define en:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

## Rutas principales

- `/` — Menú público y pedido por WhatsApp
- `/mis-pedidos` — Historial del usuario
- `/auth/login` — Login
- `/auth/register` — Registro
- `/admin` — Panel administrador
