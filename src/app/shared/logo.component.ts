import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Logo de NotTupper. Tres variantes:
 *   - icon   : sólo las hojas (para FAB, favicon, marcas chicas)
 *   - inline : hojas + "NOT TUPPER" horizontal (navbar)
 *   - full   : hojas grandes + "NOT" / "TUPPER" apilados + "FREEZA TU SEMANA" (hero, auth)
 *
 * La leaves mantiene su color de marca (terracota) en ambos modos.
 * El wordmark adapta según [light] prop (forzar cream) o según el token
 * global --logo-wordmark (cream en dark, forest en light).
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="logo logo--{{ variant }}" [class.logo--light]="light" [attr.aria-label]="'NotTupper'">
      <svg class="logo__leaves"
           viewBox="-42 -60 84 66"
           fill="none" stroke="currentColor"
           stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true">
        <!-- Hoja central (más grande y generosa) -->
        <path d="M 0 -2
                 C 11 -16, 11 -40, 0 -54
                 C -11 -40, -11 -16, 0 -2 Z" />
        <!-- Hoja izquierda (rotada -30°) -->
        <g transform="rotate(-30)">
          <path d="M 0 0
                   C 7 -14, 7 -32, 0 -44
                   C -7 -32, -7 -14, 0 0 Z" />
        </g>
        <!-- Hoja derecha (espejo) -->
        <g transform="rotate(30)">
          <path d="M 0 0
                   C 7 -14, 7 -32, 0 -44
                   C -7 -32, -7 -14, 0 0 Z" />
        </g>
      </svg>

      @if (variant !== 'icon') {
        <div class="logo__wordmark">
          @if (variant === 'full') {
            <span class="logo__not">NOT</span>
            <span class="logo__tupper">TUPPER</span>
            <span class="logo__tagline">FREEZA TU SEMANA</span>
          } @else {
            <span class="logo__not-inline">NOT</span><span class="logo__tupper-inline">TUPPER</span>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .logo {
      display: inline-flex;
      align-items: center;
      color: var(--color-terracotta, #D96842);  /* leaves color */
    }

    .logo__leaves { flex-shrink: 0; }

    /* ─── inline ─── horizontal: leaves chiquitas + "NOT TUPPER" */
    .logo--inline { gap: 10px; }
    .logo--inline .logo__leaves { width: 28px; height: 28px; }
    .logo--inline .logo__wordmark {
      display: inline-flex; align-items: baseline; gap: 2px;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.6rem; letter-spacing: 0.06em; line-height: 1;
    }
    .logo--inline .logo__not-inline,
    .logo--inline .logo__tupper-inline {
      color: var(--logo-wordmark, var(--brand, #2E5935));
    }
    /* En contexto light (navbar forest) el wordmark se fuerza a cream */
    .logo--light.logo--inline .logo__not-inline,
    .logo--light.logo--inline .logo__tupper-inline {
      color: var(--color-cream, #F2EBDF);
    }

    /* ─── full ─── stacked vertical para hero / auth */
    .logo--full {
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .logo--full .logo__leaves {
      width: clamp(64px, 11vw, 88px);
      height: clamp(56px, 10vw, 76px);
      margin-bottom: 4px;
    }
    .logo--full .logo__wordmark {
      display: flex; flex-direction: column; align-items: center;
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 0.04em;
      line-height: 0.92;
    }
    .logo--full .logo__not {
      font-size: clamp(2.4rem, 6vw, 3.4rem);
      color: var(--logo-wordmark, var(--brand, #2E5935));
    }
    .logo--full .logo__tupper {
      font-size: clamp(3.2rem, 8vw, 4.6rem);
      color: var(--logo-wordmark, var(--brand, #2E5935));
    }
    .logo--full .logo__tagline {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 0.82rem;
      letter-spacing: 0.32em;
      margin-top: 10px;
      color: var(--logo-wordmark, var(--brand, #2E5935));
      opacity: 0.85;
    }
    /* Variante light: todo el wordmark en cream (para bg oscuro) */
    .logo--light.logo--full .logo__not,
    .logo--light.logo--full .logo__tupper,
    .logo--light.logo--full .logo__tagline {
      color: var(--color-cream, #F2EBDF);
    }

    /* ─── icon ─── sólo las hojas */
    .logo--icon .logo__leaves { width: 32px; height: 32px; }
  `]
})
export class LogoComponent {
  @Input() variant: 'icon' | 'inline' | 'full' = 'inline';
  /** Fuerza el wordmark a cream (útil sobre fondos oscuros como el navbar forest). */
  @Input() light = false;
}
