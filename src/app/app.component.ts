import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { LogoComponent } from './shared/logo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, LogoComponent],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="navbar__brand" aria-label="NotTupper — ir al menú">
        <app-logo variant="inline" [light]="true" />
      </a>

      <div class="navbar__links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Menú</a>
        @if (auth.isLogged() && !auth.isAdmin()) {
          <a routerLink="/mis-pedidos" routerLinkActive="active">Mis pedidos</a>
        }
        @if (auth.isAdmin()) {
          <a routerLink="/admin" routerLinkActive="active">Panel Admin</a>
        }
      </div>

      <div class="navbar__actions">
        <button class="theme-toggle"
                (click)="theme.toggle()"
                [attr.aria-label]="theme.isDark() ? 'Activar modo claro' : 'Activar modo oscuro'"
                [title]="theme.isDark() ? 'Modo claro' : 'Modo oscuro'">
          @if (theme.isDark()) {
            <!-- Sol (click → modo claro) -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4.5"/>
              <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          } @else {
            <!-- Luna (click → modo oscuro) -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
            </svg>
          }
        </button>

        @if (auth.isLogged()) {
          <a routerLink="/mis-pedidos" class="navbar__user">{{ auth.user()?.nombre }}</a>
          <button class="btn-nav btn-nav--ghost" (click)="auth.logout()">Salir</button>
        } @else {
          <a routerLink="/auth/login" class="btn-nav btn-nav--outline">Ingresar</a>
          <a routerLink="/auth/register" class="btn-nav btn-nav--accent">Registrarse</a>
        }
      </div>

      <button class="navbar__burger" (click)="mobileOpen = !mobileOpen" [class.open]="mobileOpen"
              [attr.aria-label]="mobileOpen ? 'Cerrar menú' : 'Abrir menú'">
        <span></span><span></span><span></span>
      </button>
    </nav>

    @if (mobileOpen) {
      <div class="mobile-menu" (click)="mobileOpen = false">
        <a routerLink="/">Menú</a>
        @if (auth.isLogged() && !auth.isAdmin()) {
          <a routerLink="/mis-pedidos">Mis pedidos</a>
        }
        @if (auth.isAdmin()) { <a routerLink="/admin">Panel Admin</a> }

        <button class="mobile-menu__theme" (click)="theme.toggle(); $event.stopPropagation()">
          @if (theme.isDark()) {
            ☀︎ Modo claro
          } @else {
            ☾ Modo oscuro
          }
        </button>

        @if (auth.isLogged()) {
          <button (click)="auth.logout()">Salir</button>
        } @else {
          <a routerLink="/auth/login">Ingresar</a>
          <a routerLink="/auth/register">Registrarse</a>
        }
      </div>
    }

    <main class="main-content">
      <router-outlet />
    </main>
  `,
  styles: [`
    /* Navbar: forest sólido en ambos modos (marca consistente) */
    .navbar {
      position: sticky; top: 0; z-index: 100;
      display: flex; align-items: center; gap: 20px;
      padding: 0 32px; height: 64px;
      background: #2E5935;
      border-bottom: 1px solid rgba(217, 188, 154, 0.25);
      box-shadow: 0 2px 12px rgba(12, 13, 13, 0.06);
    }

    .navbar__brand {
      display: flex; align-items: center;
      text-decoration: none; flex-shrink: 0;
    }

    .navbar__links { display: flex; gap: 2px; flex: 1; margin-left: 12px; }
    .navbar__links a {
      padding: 6px 16px; border-radius: 6px;
      font-weight: 700; font-size: 0.82rem;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: rgba(242, 235, 223, 0.75);
      transition: color 0.2s, background 0.2s;
      text-decoration: none;
    }
    .navbar__links a:hover  { color: #F2EBDF; background: rgba(242, 235, 223, 0.08); }
    .navbar__links a.active {
      color: #F2EBDF;
      box-shadow: inset 0 -2px 0 #D9BC9A;
    }

    .navbar__actions { display: flex; align-items: center; gap: 10px; }

    /* Toggle sun/moon */
    .theme-toggle {
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      background: transparent;
      border: 1.5px solid rgba(242, 235, 223, 0.25);
      border-radius: 50%;
      cursor: pointer;
      color: #F2EBDF;
      transition: all 0.2s ease;
      padding: 0;
    }
    .theme-toggle:hover {
      background: rgba(242, 235, 223, 0.1);
      border-color: rgba(242, 235, 223, 0.5);
      transform: scale(1.05);
    }
    .theme-toggle svg { width: 18px; height: 18px; }

    .navbar__user {
      font-weight: 700; font-size: 0.85rem;
      color: rgba(242, 235, 223, 0.85);
      padding: 0 4px; text-decoration: none;
      transition: color 0.15s;
    }
    .navbar__user:hover { color: #D9BC9A; }

    .btn-nav {
      padding: 7px 18px; border-radius: 20px;
      border: none; font-family: 'Bebas Neue', sans-serif;
      font-size: 1rem; letter-spacing: 0.08em; cursor: pointer;
      transition: all 0.15s; text-decoration: none;
      display: inline-flex; align-items: center;
    }
    .btn-nav--accent {
      background: #D9BC9A; color: #1E3D23;
    }
    .btn-nav--accent:hover { background: #C4A47E; }
    .btn-nav--outline {
      background: transparent; color: #F2EBDF;
      border: 1.5px solid rgba(242, 235, 223, 0.6);
    }
    .btn-nav--outline:hover { background: rgba(242, 235, 223, 0.1); border-color: #F2EBDF; }
    .btn-nav--ghost {
      background: transparent;
      color: rgba(242, 235, 223, 0.7);
    }
    .btn-nav--ghost:hover { color: #F2EBDF; }

    .navbar__burger {
      display: none; flex-direction: column; gap: 5px;
      background: none; border: none; cursor: pointer;
      padding: 4px; margin-left: auto;
    }
    .navbar__burger span {
      display: block; width: 22px; height: 2px;
      background: #F2EBDF; border-radius: 1px; transition: 0.2s;
    }

    .mobile-menu {
      position: fixed; inset: 64px 0 0 0; z-index: 99;
      background: #2E5935;
      display: flex; flex-direction: column;
      padding: 20px; gap: 4px;
      border-top: 1px solid rgba(217, 188, 154, 0.25);
    }
    .mobile-menu a, .mobile-menu button {
      padding: 14px 16px; border-radius: 8px;
      font-weight: 700; font-size: 1.1rem; letter-spacing: 0.05em;
      color: #F2EBDF; background: none; border: none;
      cursor: pointer; text-align: left;
      font-family: 'Nunito', sans-serif; text-decoration: none;
    }
    .mobile-menu a:hover, .mobile-menu button:hover {
      background: rgba(242, 235, 223, 0.08);
    }
    .mobile-menu__theme {
      border-top: 1px solid rgba(242, 235, 223, 0.15) !important;
      margin-top: 8px;
      padding-top: 18px !important;
    }

    .main-content { min-height: calc(100vh - 64px); }

    @media (max-width: 640px) {
      .navbar { padding: 0 20px; gap: 12px; }
      .navbar__links, .navbar__actions { display: none; }
      .navbar__burger { display: flex; }
    }
  `]
})
export class AppComponent {
  mobileOpen = false;
  constructor(public auth: AuthService, public theme: ThemeService) {}
}
