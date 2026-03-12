import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="admin-page">
      <div class="admin-page__inner">
        <div class="page-header">
          <h1>Panel Admin</h1>
          <p class="subtitle">Hola, {{ auth.user()?.nombre }} 👋</p>
          <div class="gold-line"></div>
        </div>

        <div class="admin-grid">
          <a routerLink="/admin/viandas" class="admin-tile">
            <span class="admin-tile__icon">🍱</span>
            <h3>Viandas</h3>
            <p>Armá y activá el menú de la semana</p>
            <span class="admin-tile__arrow">→</span>
          </a>

          <a routerLink="/admin/comidas" class="admin-tile">
            <span class="admin-tile__icon">🍽️</span>
            <h3>Comidas</h3>
            <p>Gestioná el catálogo reutilizable</p>
            <span class="admin-tile__arrow">→</span>
          </a>

          <a routerLink="/admin/pedidos" class="admin-tile">
            <span class="admin-tile__icon">🧾</span>
            <h3>Pedidos</h3>
            <p>Seguí y actualizá el estado</p>
            <span class="admin-tile__arrow">→</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      padding: 40px 24px;
      min-height: calc(100vh - 60px);
    }
    .admin-page__inner { max-width: 900px; margin: 0 auto; }

    .admin-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
      margin-top: 8px;
    }

    .admin-tile {
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 28px 24px;
      text-decoration: none;
      transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
      position: relative;
      animation: fadeUp 0.4s ease both;
      @for $i from 1 through 3 {
        &:nth-child(#{$i}) { animation-delay: #{($i - 1) * 0.08}s; }
      }

      &:hover {
        border-color: var(--gold);
        transform: translateY(-3px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      }

      &__icon { font-size: 2.2rem; margin-bottom: 14px; }
      h3 { font-family: var(--font-display); font-size: 1.5rem; color: var(--text); margin-bottom: 6px; }
      p  { font-size: 0.88rem; color: var(--text-muted); flex: 1; }

      &__arrow {
        position: absolute;
        bottom: 24px;
        right: 24px;
        font-size: 1.2rem;
        color: var(--gold);
        transition: transform 0.2s;
      }
      &:hover &__arrow { transform: translateX(4px); }
    }
  `]
})
export class AdminDashboardComponent {
  constructor(public auth: AuthService) {}
}
