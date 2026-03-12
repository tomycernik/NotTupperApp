# 🍱 NotTupper — App (Angular 18)

Frontend Angular para el emprendimiento de viandas saludables.

## 🚀 Instalación

```bash
npm install
ng serve         # dev → http://localhost:4200
ng build         # prod → dist/
```

## 🔧 Configuración

Editá `src/environments/environment.ts` con la URL de tu API:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

## 📱 Pantallas

| Ruta | Descripción | Auth |
|------|-------------|------|
| `/` | Menú activo — elegir vianda y pedir | Pública |
| `/auth/login` | Login | Pública |
| `/auth/register` | Registro | Pública |
| `/admin` | Dashboard admin | ADMIN |
| `/admin/viandas` | Crear/editar viandas y asignar comidas | ADMIN |
| `/admin/comidas` | Catálogo de platos reutilizables | ADMIN |
| `/admin/pedidos` | Ver y gestionar pedidos | ADMIN |

## 🏗️ Arquitectura

```
src/app/
├── core/
│   ├── models/        → Interfaces TypeScript
│   ├── services/      → auth, vianda, comida, pedido
│   ├── guards/        → authGuard, adminGuard, guestGuard
│   └── interceptors/  → JWT en headers automático
├── features/
│   ├── menu/          → Página principal pública
│   ├── auth/          → Login + Registro
│   └── admin/         → Dashboard + Viandas + Comidas + Pedidos
└── environments/      → dev / prod
```

## 🎨 Design

- Fondo oscuro `#1a1a1a` + dorado `#c9a84c`
- **Bebas Neue** para títulos (igual que el logo)
- **Nunito** para cuerpo
- Componentes standalone (Angular 18)
- Signals para estado reactivo
