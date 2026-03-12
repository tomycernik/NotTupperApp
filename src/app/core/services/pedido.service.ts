import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pedido, PedidoEstado, PedidoTamano, ApiResponse } from '../models/index';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private base = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  crear(vianda_id: string, tamano: PedidoTamano, observaciones?: string): Observable<Pedido> {
    return this.http.post<ApiResponse<Pedido>>(this.base, { vianda_id, tamano, observaciones })
      .pipe(map(r => r.data!));
  }

  getMisPedidos(): Observable<Pedido[]> {
    return this.http.get<ApiResponse<Pedido[]>>(`${this.base}/mis-pedidos`)
      .pipe(map(r => r.data ?? []));
  }

  getAll(estado?: PedidoEstado): Observable<Pedido[]> {
    const params = estado ? `?estado=${estado}` : '';
    return this.http.get<ApiResponse<Pedido[]>>(`${this.base}${params}`)
      .pipe(map(r => r.data ?? []));
  }

  actualizarEstado(id: string, estado: PedidoEstado): Observable<Pedido> {
    return this.http.patch<ApiResponse<Pedido>>(`${this.base}/${id}/estado`, { estado })
      .pipe(map(r => r.data!));
  }

  cancelar(id: string): Observable<Pedido> {
    return this.http.patch<ApiResponse<Pedido>>(`${this.base}/${id}/cancelar`, {})
      .pipe(map(r => r.data!));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}