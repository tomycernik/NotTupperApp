// ─── User ─────────────────────────────────────────────────────────────────────
export type UserRol = 'USER' | 'ADMIN';

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email?: string;
  celular: string;
  zona: string;
  rol: UserRol;
}

export interface AuthUser extends User {
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  zona: string;
  password: string;
}

// ─── Comida ───────────────────────────────────────────────────────────────────
export type ComidaTipo = 'COMUN' | 'VEGETARIANA' | 'AMBAS';

export interface Comida {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: ComidaTipo;
  activa: boolean;
}

// ─── Vianda ───────────────────────────────────────────────────────────────────
export type ViandaTipo = 'COMUN' | 'VEGETARIANA';

export interface Vianda {
  id: string;
  nombre: string;
  tipo: ViandaTipo;
  activo: boolean;
  observaciones?: string;
  comidas?: Comida[];
}

// ─── Pedido ───────────────────────────────────────────────────────────────────
export type PedidoEstado = 'PENDIENTE' | 'EN_PROCESO' | 'ENTREGADO' | 'CANCELADO';
export type PedidoTamano = 'CHICA' | 'GRANDE';

export interface PedidoExtra {
  id?: string;
  tipo: 'empanada' | 'pizza';
  sabor: string;
  cantidad: number;
}

export interface Pedido {
  id: string;
  usuario_id: string;
  vianda_id?: string;
  tamano: PedidoTamano;
  estado: PedidoEstado;
  observaciones?: string;
  created_at: string;
  usuario?: {
    nombre: string;
    apellido: string;
    celular: string;
    zona: string;
  };
  vianda?: {
    nombre: string;
    tipo: string;
  };
  extras?: PedidoExtra[];
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}