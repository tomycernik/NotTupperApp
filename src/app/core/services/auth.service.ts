import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthUser, LoginPayload, RegisterPayload, ApiResponse } from '../models/index';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'nt_token';
  private readonly USER_KEY  = 'nt_user';

  private _user = signal<AuthUser | null>(this.loadUser());

  readonly user     = this._user.asReadonly();
  readonly isLogged = computed(() => !!this._user());
  readonly isAdmin  = computed(() => this._user()?.rol === 'ADMIN');

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: LoginPayload): Observable<ApiResponse<AuthUser>> {
    return this.http.post<ApiResponse<AuthUser>>(`${environment.apiUrl}/users/login`, payload)
      .pipe(tap(res => { if (res.data) this.persist(res.data); }));
  }

  register(payload: RegisterPayload): Observable<ApiResponse<AuthUser>> {
    return this.http.post<ApiResponse<AuthUser>>(`${environment.apiUrl}/users/register`, payload)
      .pipe(tap(res => { if (res.data) this.persist(res.data); }));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._user.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private persist(user: AuthUser): void {
    localStorage.setItem(this.TOKEN_KEY, user.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._user.set(user);
  }

  private loadUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
