import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

/**
 * Manages app-wide theme (light/dark).
 *
 * Orden de resolución al iniciar:
 *   1. Valor guardado en localStorage
 *   2. prefers-color-scheme del sistema
 *   3. 'light' como fallback
 *
 * El modo se aplica seteando la clase `.dark-mode` en <html>,
 * de manera que los CSS custom properties globales quedan overrideados.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'nt_theme';

  readonly theme = signal<Theme>(this.getInitial());

  constructor() {
    effect(() => {
      const t = this.theme();
      const root = document.documentElement;
      if (t === 'dark') root.classList.add('dark-mode');
      else               root.classList.remove('dark-mode');
      try { localStorage.setItem(this.STORAGE_KEY, t); } catch { /* noop */ }
    });
  }

  toggle(): void {
    this.theme.update(t => (t === 'light' ? 'dark' : 'light'));
  }

  set(t: Theme): void { this.theme.set(t); }

  isDark(): boolean { return this.theme() === 'dark'; }

  private getInitial(): Theme {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
      if (saved === 'dark' || saved === 'light') return saved;
    } catch { /* noop */ }
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
}
