import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Comida, ApiResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ComidaService {
  private base = `${environment.apiUrl}/comidas`;

  constructor(private http: HttpClient) {}

  getAll(soloActivas = false): Observable<Comida[]> {
    const params = soloActivas ? '?soloActivas=true' : '';
    return this.http.get<ApiResponse<Comida[]>>(`${this.base}${params}`)
      .pipe(map(r => r.data ?? []));
  }

  create(data: Partial<Comida>): Observable<Comida> {
    return this.http.post<ApiResponse<Comida>>(this.base, data)
      .pipe(map(r => r.data!));
  }

  update(id: string, data: Partial<Comida>): Observable<Comida> {
    return this.http.patch<ApiResponse<Comida>>(`${this.base}/${id}`, data)
      .pipe(map(r => r.data!));
  }

  toggle(id: string): Observable<Comida> {
    return this.http.patch<ApiResponse<Comida>>(`${this.base}/${id}/toggle`, {})
      .pipe(map(r => r.data!));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
