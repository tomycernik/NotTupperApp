import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Vianda, ApiResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ViandaService {
  private base = `${environment.apiUrl}/viandas`;

  constructor(private http: HttpClient) {}

  getAll(soloActivas = false): Observable<Vianda[]> {
    const params = soloActivas ? '?soloActivas=true' : '';
    return this.http.get<ApiResponse<Vianda[]>>(`${this.base}${params}`)
      .pipe(map(r => r.data ?? []));
  }

  getById(id: string): Observable<Vianda> {
    return this.http.get<ApiResponse<Vianda>>(`${this.base}/${id}`)
      .pipe(map(r => r.data!));
  }

  create(data: Partial<Vianda>): Observable<Vianda> {
    return this.http.post<ApiResponse<Vianda>>(this.base, data)
      .pipe(map(r => r.data!));
  }

  update(id: string, data: Partial<Vianda>): Observable<Vianda> {
    return this.http.patch<ApiResponse<Vianda>>(`${this.base}/${id}`, data)
      .pipe(map(r => r.data!));
  }

  toggle(id: string): Observable<Vianda> {
    return this.http.patch<ApiResponse<Vianda>>(`${this.base}/${id}/toggle`, {})
      .pipe(map(r => r.data!));
  }

  asignarComidas(viandaId: string, comidas: { comidaId: string; orden?: number }[]): Observable<void> {
    return this.http.put<void>(`${this.base}/${viandaId}/comidas`, { comidas });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
