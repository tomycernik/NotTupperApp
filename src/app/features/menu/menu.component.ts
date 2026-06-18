import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViandaService } from '../../core/services/vianda.service';
import { AuthService } from '../../core/services/auth.service';
import { Vianda, PedidoTamano } from '../../core/models/index';
import { LogoComponent } from '../../shared/logo.component';

interface ViandaSeleccionada {
  vianda: Vianda;
  tamano: PedidoTamano;
  cantidad: number;
}

type ExtraTipo = 'empanada' | 'pizza' | 'tarta' | 'kids';

interface ExtraItem {
  id: string;
  tipo: ExtraTipo;
  sabor: string;
  precio: number;
  cantidad: number;
}

interface CatalogProduct {
  nombre: string;
  precio: number;
}

interface CatalogGroup {
  titulo?: string;
  items: CatalogProduct[];
}

interface CatalogSection {
  tipo: ExtraTipo;
  titulo: string;
  subtitulo: string;
  bajada: string;
  image: string;
  groups: CatalogGroup[];
}

interface KidsFeature {
  titulo: string;
  texto: string;
}

interface KidsMenuItem {
  nombre: string;
  precio: number;
}

interface KidsImportant {
  titulo: string;
  texto: string;
}

interface PedidoDraftItem {
  viandaId: string;
  tamano: PedidoTamano;
  cantidad: number;
}

interface PedidoDraft {
  viandas: PedidoDraftItem[];
  extras: Record<string, number>;
  observaciones: string;
}

const WHATSAPP_PHONE = '5491167353868';
const KIDS_PRICE = 7000;
const FOOD_IMAGES = {
  hero: 'assets/food/pack-semanal.png',
  intro: 'assets/food/vianda-colorida.png',
  commonPack: 'assets/food/pack-semanal.png',
  vegPack: 'assets/food/pack-vegetariano.png',
  empanadas: 'assets/food/empanadas.png',
  pizza: 'assets/food/pizza.png',
  tarta: 'assets/food/tarta.png',
  orderedPack: 'assets/food/pack-ordenado.png',
  saucePack: 'assets/food/vianda-salsa.png',
};

const CATALOG_SECTIONS: CatalogSection[] = [
  {
    tipo: 'empanada',
    titulo: 'Empanadas',
    subtitulo: 'x 6 unidades',
    bajada: 'Media docena de empanadas caseras para sumar al pedido o resolver una comida rápida.',
    image: FOOD_IMAGES.empanadas,
    groups: [
      {
        items: [
          { nombre: 'Carne cortada a cuchillo', precio: 12000 },
          { nombre: 'Carne suave', precio: 10000 },
          { nombre: 'Atún', precio: 10000 },
          { nombre: 'Verdura', precio: 10000 },
          { nombre: 'Choclo', precio: 10000 },
          { nombre: 'Pollo', precio: 10000 },
          { nombre: 'Cheese burguer', precio: 10000 },
        ],
      },
    ],
  },
  {
    tipo: 'pizza',
    titulo: 'Pizzas',
    subtitulo: 'listas para freezer',
    bajada: 'Pizzas simples, rendidoras y freezables para tener una comida lista sin vueltas.',
    image: FOOD_IMAGES.pizza,
    groups: [
      {
        titulo: 'Harina común',
        items: [
          { nombre: 'Tomate y queso', precio: 10000 },
          { nombre: 'Cebolla y queso', precio: 10000 },
        ],
      },
      {
        titulo: 'Harina integral',
        items: [
          { nombre: 'Tomate y queso integral', precio: 10000 },
          { nombre: 'Cebolla y queso integral', precio: 10000 },
        ],
      },
    ],
  },
  {
    tipo: 'tarta',
    titulo: 'Tartas',
    subtitulo: '24 cm.',
    bajada: 'Tartas caseras para compartir, freezar o tener una cena práctica resuelta.',
    image: FOOD_IMAGES.tarta,
    groups: [
      {
        items: [
          { nombre: 'Capresse', precio: 15000 },
          { nombre: 'Cebolla y queso', precio: 15000 },
          { nombre: 'Choclo', precio: 15000 },
          { nombre: 'Verdura', precio: 15000 },
          { nombre: 'Atún', precio: 15000 },
          { nombre: 'Jamón y queso', precio: 15000 },
        ],
      },
    ],
  },
];

const KIDS_FEATURES: KidsFeature[] = [
  {
    titulo: 'Pensado para chicos y teens',
    texto: 'Sabores simples, conocidos y fáciles de recibir bien.',
  },
  {
    titulo: 'Platos que funcionan',
    texto: 'Comidas ricas, clásicas y prácticas para todos los días.',
  },
  {
    titulo: 'Ideal para viandas escolares',
    texto: 'Para el cole, actividades y semanas con poco tiempo.',
  },
  {
    titulo: 'Freezer friendly',
    texto: 'Sacás, calentás y listo. Se entregan freezados.',
  },
];

const KIDS_MENU_ITEMS: KidsMenuItem[] = [
  { nombre: 'Empanadas cheeseburger', precio: KIDS_PRICE },
  { nombre: 'Filet rebozado con puré', precio: KIDS_PRICE },
  { nombre: 'Hamburguesa de pollo con muffin de brócoli y muzzarella', precio: KIDS_PRICE },
  { nombre: 'Canastitas de jamón y queso', precio: KIDS_PRICE },
  { nombre: 'Milanesa de pollo con omelette', precio: KIDS_PRICE },
  { nombre: 'Ñoquis con salsa suave', precio: KIDS_PRICE },
  { nombre: 'Mac & cheese', precio: KIDS_PRICE },
  { nombre: 'Revuelto de zapallito con nuggets', precio: KIDS_PRICE },
  { nombre: 'Panchitos enrollados con batatas al horno', precio: KIDS_PRICE },
  { nombre: 'Milanesa de soja con papas al horno', precio: KIDS_PRICE },
];

const KIDS_IMPORTANT: KidsImportant[] = [
  {
    titulo: 'No se modifica',
    texto: 'El acompañamiento se entrega tal cual figura en el menú.',
  },
  {
    titulo: 'Entrega freezada',
    texto: 'Listo para guardar y organizar la semana.',
  },
  {
    titulo: 'Valor lanzamiento',
    texto: '$7.000 cada plato.',
  },
];

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoComponent],
  template: `
    <div class="page">
      <header class="hero">
        <div class="hero__inner">
          <section class="hero__copy">
            <p class="eyebrow">Viandas caseras freezadas</p>
            <h1>Viandas caseras freezadas para resolver tu semana</h1>
            <p class="hero__lead">
              Packs de 5 comidas listas para calentar. Pedís hasta el miércoles,
              recibís el finde y guardás en el freezer.
            </p>

            <div class="hero__actions">
              <button class="btn-main" type="button" (click)="scrollAlMenu()">Ver menú semanal</button>
              <a class="btn-secondary" [href]="consultaWhatsappUrl()" target="_blank" rel="noopener">
                Pedir por WhatsApp
              </a>
            </div>

            <div class="hero__badges" aria-label="Resumen de la propuesta">
              <span>5 comidas por pack</span>
              <span>300g o 500g</span>
              <span>Pedido simple por WhatsApp</span>
            </div>
          </section>

          <section class="hero__visual" aria-label="Espacio para foto real de viandas">
            <div class="image-frame image-frame--hero">
              <img [src]="foodImages.hero" alt="Pack semanal de viandas caseras freezadas" />
            </div>
            <div class="hero__price-card">
              <span>Pack 5 comidas · 300g</span>
              <strong>$35.000</strong>
            </div>
            <div class="hero__price-card hero__price-card--light">
              <span>Pack 5 comidas · 500g</span>
              <strong>$45.000</strong>
            </div>
          </section>
        </div>
      </header>

      <section class="intro section-band">
        <div class="section-inner intro__grid">
          <div>
            <p class="section-kicker">¿Qué es Not Tupper?</p>
            <h2>Comida casera lista para freezer, sin resolver el menú todos los días</h2>
            <p>
              Cocinamos viandas semanales con ingredientes reales, porciones prácticas y entrega freezada.
              Son ideales para almuerzos, cenas, oficina, estudio o semanas con poco tiempo.
            </p>
          </div>
          <div class="intro__media image-frame">
            <img [src]="foodImages.intro" alt="Viandas caseras listas para guardar en freezer" />
          </div>
        </div>
      </section>

      <section class="steps section-band section-band--soft">
        <div class="section-inner">
          <div class="section-head">
            <p class="section-kicker">Cómo funciona</p>
            <h2>Pedís fácil y recibís freezado</h2>
          </div>
          <div class="steps__grid">
            <article class="step-card">
              <span class="step-card__num">1</span>
              <h3>Elegís tus viandas</h3>
              <p>Seleccionás menú común, vegetariano o extras.</p>
            </article>
            <article class="step-card">
              <span class="step-card__num">2</span>
              <h3>Armás tu pedido</h3>
              <p>Sumás 300g o 500g y ves el total estimado.</p>
            </article>
            <article class="step-card">
              <span class="step-card__num">3</span>
              <h3>Lo enviás por WhatsApp</h3>
              <p>Te abrimos el mensaje armado para confirmar.</p>
            </article>
            <article class="step-card">
              <span class="step-card__num">4</span>
              <h3>Recibís y freezás</h3>
              <p>Entregamos sábado o domingo, listo para guardar.</p>
            </article>
          </div>

          <div class="logistics">
            <div><strong>Pedís hasta el miércoles</strong><span>Cierre semanal simple y ordenado.</span></div>
            <div><strong>Entregamos sábado o domingo</strong><span>Coordinamos por WhatsApp.</span></div>
            <div><strong>Se entregan freezadas</strong><span>Guardás en freezer y calentás cuando querés.</span></div>
            <div><strong>Pagás por transferencia o efectivo</strong><span>Sin pasos raros en la web.</span></div>
          </div>
        </div>
      </section>

      <div class="layout section-inner" id="menu">
        <main class="col-main">
          <section class="block">
            <div class="section-head section-head--left">
              <p class="section-kicker">Menú semanal</p>
              <h2>Elegí tus viandas</h2>
              <p>Cada pack trae 5 comidas. Podés pedir tamaño 300g o 500g y sumar extras.</p>
            </div>

            <div class="weekly-hero">
              <div>
                <span class="weekly-hero__tag">Producto principal</span>
                <h3>Pack semanal x5 comidas</h3>
                <p>La base de Not Tupper: cinco viandas caseras freezadas para ordenar almuerzos y cenas de la semana.</p>
              </div>
              <div class="weekly-hero__prices" aria-label="Precios del pack semanal">
                <span><strong>$35.000</strong>300g</span>
                <span><strong>$45.000</strong>500g</span>
              </div>
            </div>

            @if (loading()) {
              <div class="products-grid">
                @for (i of [1,2]; track i) {
                  <div class="product-card product-card--loading">
                    <div class="sk sk--image"></div>
                    <div class="sk sk--title"></div>
                    <div class="sk sk--line"></div>
                    <div class="sk sk--line"></div>
                  </div>
                }
              </div>
            } @else if (viandas().length === 0) {
              <div class="empty">
                <span class="empty__icon">Menú</span>
                <h3>No hay menú disponible por el momento</h3>
                <p>Consultanos por WhatsApp y te avisamos cuando abrimos pedidos.</p>
                <a class="btn-main btn-main--small" [href]="consultaWhatsappUrl()" target="_blank" rel="noopener">Consultar</a>
              </div>
            } @else {
              <div class="products-grid">
                @for (v of viandas(); track v.id; let i = $index) {
                  <article class="product-card" [class.product-card--veg]="v.tipo === 'VEGETARIANA'">
                    <div class="product-card__media image-frame">
                      <img [src]="productImage(v)" [alt]="displayMenuName(v)" />
                    </div>

                    <div class="product-card__body">
                      <div class="product-card__top">
                        <span class="tipo-pill" [class.tipo-pill--veg]="v.tipo === 'VEGETARIANA'">
                          {{ v.tipo === 'COMUN' ? 'Común' : 'Vegetariana' }}
                        </span>
                        <span class="product-card__pack">Pack x5</span>
                      </div>

                      <h3>{{ displayMenuName(v) }}</h3>

                      @if (v.comidas && v.comidas.length > 0) {
                        <ul class="meal-list">
                          @for (c of v.comidas; track c.id) {
                            <li>{{ c.nombre }}</li>
                          }
                        </ul>
                      } @else {
                        <p class="product-card__hint">Consultanos por las comidas incluidas esta semana.</p>
                      }

                      @if (v.observaciones) {
                        <p class="product-card__obs">{{ v.observaciones }}</p>
                      }

                      <div class="size-options">
                        <div class="size-option">
                          <button class="size-btn"
                                  [class.size-btn--active]="getCantidadPorTamano(v, 'CHICA') > 0"
                                  type="button"
                                  (click)="setTamano(v, 'CHICA')">
                            Sumar 300g · $35.000
                          </button>
                          @if (getCantidadPorTamano(v, 'CHICA') > 0) {
                            <div class="qty-control" aria-label="Cantidad 300g">
                              <button type="button" (click)="cambiarCantidadPorTamano(v, 'CHICA', -1)">-</button>
                              <span>{{ getCantidadPorTamano(v, 'CHICA') }}</span>
                              <button type="button" (click)="cambiarCantidadPorTamano(v, 'CHICA', 1)">+</button>
                            </div>
                          }
                        </div>

                        <div class="size-option">
                          <button class="size-btn"
                                  [class.size-btn--active]="getCantidadPorTamano(v, 'GRANDE') > 0"
                                  type="button"
                                  (click)="setTamano(v, 'GRANDE')">
                            Sumar 500g · $45.000
                          </button>
                          @if (getCantidadPorTamano(v, 'GRANDE') > 0) {
                            <div class="qty-control" aria-label="Cantidad 500g">
                              <button type="button" (click)="cambiarCantidadPorTamano(v, 'GRANDE', -1)">-</button>
                              <span>{{ getCantidadPorTamano(v, 'GRANDE') }}</span>
                              <button type="button" (click)="cambiarCantidadPorTamano(v, 'GRANDE', 1)">+</button>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </article>
                }
              </div>
            }
          </section>

          <section class="catalog-shell">
            <div class="section-head section-head--left">
              <p class="section-kicker">Catálogo de extras</p>
              <h2>Sumá algo rico al freezer</h2>
              <p>Empanadas, pizzas y tartas con precios claros para agregar al pedido o consultar por separado.</p>
            </div>

            <div class="catalog-grid">
              @for (section of catalogSections; track section.tipo) {
                <article class="catalog-card">
                  <div class="catalog-card__media image-frame">
                    <img [src]="section.image" [alt]="section.titulo + ' Not Tupper'" />
                  </div>

                  <div class="catalog-card__paper">
                    <div class="catalog-card__banner">{{ section.titulo }}</div>
                    <p class="catalog-card__subtitle">{{ section.subtitulo }}</p>
                    <p class="catalog-card__bajada">{{ section.bajada }}</p>

                    <div class="catalog-card__groups">
                      @for (group of section.groups; track group.titulo || $index) {
                        <div class="catalog-group">
                          @if (group.titulo) {
                            <p class="catalog-group__title">{{ group.titulo }}</p>
                          }

                          @for (item of group.items; track item.nombre) {
                            <div class="catalog-row">
                              <div class="catalog-row__copy">
                                <span>{{ item.nombre }}</span>
                                <strong>{{ formatPrice(item.precio) }}</strong>
                              </div>

                              <div class="qty-control qty-control--compact catalog-row__qty">
                                <button type="button"
                                        [attr.aria-label]="'Quitar ' + item.nombre"
                                        (click)="decrementar(section.tipo, item.nombre)">-</button>
                                <span>{{ extras[extraKey(section.tipo, item.nombre)] || 0 }}</span>
                                <button type="button"
                                        [attr.aria-label]="'Sumar ' + item.nombre"
                                        (click)="incrementar(section.tipo, item.nombre)">+</button>
                              </div>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>
                </article>
              }
            </div>
          </section>

          <section class="kids-promo">
            <div class="kids-promo__top">
              <span class="kids-promo__tag">Ya está acá</span>
              <app-logo variant="full" />
              <p class="section-kicker">Nuevo</p>
              <h2>Menú Kids & Teens</h2>
              <p class="kids-promo__lead">Comidas que sí comen, para el cole y para todos los días.</p>
            </div>

            <div class="kids-promo__features">
              @for (feature of kidsFeatures; track feature.titulo) {
                <article class="kids-feature">
                  <span aria-hidden="true"></span>
                  <strong>{{ feature.titulo }}</strong>
                  <p>{{ feature.texto }}</p>
                </article>
              }
            </div>

            <div class="kids-menu">
              <span class="kids-menu__label">Menú</span>
              <div class="kids-menu__items">
                @for (item of kidsMenuItems; track item.nombre) {
                  <div class="kids-menu-row">
                    <div>
                      <p>{{ item.nombre }}</p>
                      <strong>{{ formatPrice(item.precio) }}</strong>
                    </div>
                    <div class="qty-control qty-control--compact">
                      <button type="button"
                              [attr.aria-label]="'Quitar ' + item.nombre"
                              (click)="decrementar('kids', item.nombre)">-</button>
                      <span>{{ extras[extraKey('kids', item.nombre)] || 0 }}</span>
                      <button type="button"
                              [attr.aria-label]="'Sumar ' + item.nombre"
                              (click)="incrementar('kids', item.nombre)">+</button>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="kids-promo__bottom">
              <div class="kids-price">
                <span>Valor lanzamiento</span>
                <strong>$7.000</strong>
                <small>Cada plato</small>
              </div>

              <div class="kids-important">
                <p class="kids-important__title">Importante</p>
                @for (item of kidsImportant; track item.titulo) {
                  <div>
                    <strong>{{ item.titulo }}</strong>
                    <span>{{ item.texto }}</span>
                  </div>
                }
              </div>

              <div class="kids-cta">
                <strong>Ya podés encargar</strong>
                <p>Sumá platos desde el menú y finalizá con el mismo mensaje de WhatsApp.</p>
                <button class="btn-main btn-main--small" type="button" (click)="scrollAlPanel()">
                  Ver pedido
                </button>
              </div>
            </div>

            <p class="kids-promo__footer">
              Platos ricos, pensados para gustos reales. Simples, clásicos y siempre bien recibidos.
            </p>
          </section>
        </main>

        <aside class="col-aside" id="pedido">
          <section class="panel" [class.panel--active]="hayPedido()">
            <div class="panel__head">
              <div>
                <p class="section-kicker">Resumen</p>
                <h2>Tu pedido</h2>
              </div>
              @if (hayPedido()) {
                <button class="panel__clear" type="button" (click)="cancelar()">Limpiar</button>
              }
            </div>

            @if (!hayPedido()) {
              <div class="panel__empty">
                <span>Pedido</span>
                <strong>Tu selección aparece acá</strong>
                <p>Elegí una vianda, tamaño o extra para armar el mensaje de WhatsApp.</p>
              </div>
            } @else {
              <p class="panel__microcopy">Finalizás por WhatsApp con el mensaje armado.</p>

              @if (viandas_sel().length > 0) {
                <div class="panel__section">
                  <p class="panel__label">Viandas seleccionadas</p>
                  @for (vs of viandas_sel(); track vs.vianda.id + ':' + vs.tamano) {
                    <div class="panel-item">
                      <div>
                        <strong>{{ vs.cantidad }}x {{ displayMenuName(vs.vianda) }}</strong>
                        <span>{{ tamanoLabel(vs.tamano) }} · {{ vs.vianda.tipo === 'COMUN' ? 'Común' : 'Vegetariana' }}</span>
                      </div>
                      <div class="panel-item__right">
                        <strong>{{ formatPrice(priceFor(vs.tamano) * vs.cantidad) }}</strong>
                        <button type="button" aria-label="Quitar vianda" (click)="quitarViandaEspecifica(vs.vianda, vs.tamano)">x</button>
                      </div>
                    </div>
                  }
                </div>
              }

              @if (tieneExtras()) {
                <div class="panel__section">
                  <p class="panel__label">Extras</p>
                  @for (e of extrasSeleccionados(); track e.id) {
                    <div class="panel-extra">
                      <span>{{ e.cantidad }}x {{ extraLabel(e.tipo) }} {{ e.sabor }}</span>
                      <div class="panel-item__right">
                        <strong>{{ formatPrice(e.precio * e.cantidad) }}</strong>
                        <button type="button" aria-label="Quitar extra" (click)="quitarExtra(e)">x</button>
                      </div>
                    </div>
                  }
                </div>
              }

              <div class="panel__section">
                <label class="panel__label" for="observaciones">Observaciones</label>
                <textarea id="observaciones"
                          class="panel__textarea"
                          [(ngModel)]="observaciones"
                          (ngModelChange)="saveDraft()"
                          placeholder="Ej: sin cebolla, alergias, zona de entrega..."></textarea>
              </div>

              <div class="panel__total">
                <span>Total estimado</span>
                <strong>{{ formatPrice(totalEstimado()) }}</strong>
              </div>

              <button class="btn-confirm" type="button" (click)="confirmar()" [disabled]="!hayPedido() || loadingPedido()">
                {{ loadingPedido() ? 'Abriendo WhatsApp...' : 'Armar mensaje de WhatsApp' }}
              </button>
              <p class="panel__note">Al tocar, te abrimos WhatsApp. El pedido se confirma cuando enviás el mensaje.</p>

              @if (feedbackMsg()) {
                <div class="panel__feedback" [class.panel__feedback--ok]="feedbackOk()">{{ feedbackMsg() }}</div>
              }
            }
          </section>
        </aside>
      </div>

      <section class="benefits section-band">
        <div class="section-inner">
          <div class="section-head">
            <p class="section-kicker">Por qué elegir viandas freezadas</p>
            <h2>Comprás tiempo, orden y comida casera</h2>
          </div>
          <div class="benefits__grid">
            <article class="benefit-card">
              <div class="image-frame benefit-card__image">
                <img [src]="foodImages.orderedPack" alt="Pack de viandas organizado para la semana" />
              </div>
              <h3>Resolvé almuerzos y cenas</h3>
              <p>Tenés comida lista para calentar en días de trabajo, estudio o poco tiempo.</p>
            </article>
            <article class="benefit-card">
              <div class="image-frame benefit-card__image">
                <img [src]="foodImages.vegPack" alt="Viandas freezadas listas para guardar" />
              </div>
              <h3>Freezer organizado</h3>
              <p>Guardás los packs y usás cada porción cuando la necesitás.</p>
            </article>
            <article class="benefit-card">
              <div class="image-frame benefit-card__image">
                <img [src]="foodImages.saucePack" alt="Viandas caseras para pedir por WhatsApp" />
              </div>
              <h3>Pedido rápido por WhatsApp</h3>
              <p>Armás el pedido en la web y lo enviás con un mensaje claro.</p>
            </article>
          </div>
        </div>
      </section>

      <footer class="site-footer">
        <div class="section-inner site-footer__inner">
          <div>
            <app-logo variant="inline" />
            <p>Viandas caseras freezadas para resolver tu semana.</p>
          </div>
          <a class="btn-secondary" [href]="consultaWhatsappUrl()" target="_blank" rel="noopener">Consultar por WhatsApp</a>
        </div>
      </footer>

      @if (hayPedido()) {
        <button class="mobile-summary" type="button" (click)="scrollAlPanel()">
          <span>Ver pedido</span>
          <strong>Total estimado: {{ formatPrice(totalEstimado()) }}</strong>
        </button>
      }

      <a [href]="consultaWhatsappUrl()"
         target="_blank"
         rel="noopener"
         class="wsp-fab"
         [class.wsp-fab--raised]="hayPedido()"
         title="Consultar por WhatsApp"
         aria-label="Consultar por WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  `,
  styles: [`
    :host {
      --menu-radius: 18px;
      --menu-radius-sm: 12px;
      --soft-line: rgba(105, 115, 102, 0.16);
      display: block;
    }

    .page {
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
    }

    .section-inner {
      width: min(1120px, calc(100% - 40px));
      margin: 0 auto;
    }

    .section-band {
      padding: 56px 0;
      background: var(--bg);
    }

    .section-band--soft {
      background: var(--bg-elevated);
      border-top: 1px solid var(--border-soft);
      border-bottom: 1px solid var(--border-soft);
    }

    .section-head {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 26px;
    }

    .section-head--left {
      text-align: left;
      margin-left: 0;
      margin-right: 0;
    }

    .section-kicker,
    .eyebrow {
      color: var(--brand);
      font-size: 0.74rem;
      font-weight: 900;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    h1, h2, h3, p { margin: 0; }

    h1 {
      font-size: clamp(2.5rem, 7vw, 5.2rem);
      line-height: 0.95;
      max-width: 680px;
    }

    h2 {
      font-size: clamp(2rem, 4vw, 3.4rem);
      line-height: 1;
    }

    h3 {
      font-family: var(--font-display);
      font-size: 1.35rem;
      letter-spacing: 0.03em;
    }

    p {
      color: var(--text-muted);
    }

    .hero {
      position: relative;
      overflow: hidden;
      background:
        linear-gradient(45deg, transparent 47%, rgba(217,188,154,0.22) 47% 53%, transparent 53%),
        linear-gradient(-45deg, transparent 47%, rgba(217,188,154,0.22) 47% 53%, transparent 53%),
        var(--bg);
      background-size: 44px 44px, 44px 44px, auto;
      border-bottom: 1px solid var(--border-soft);
    }

    .hero__inner {
      width: min(1120px, calc(100% - 40px));
      min-height: calc(100vh - 64px);
      max-height: 780px;
      margin: 0 auto;
      padding: 52px 0 44px;
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
      gap: 42px;
      align-items: center;
    }

    .hero__copy {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 18px;
    }

    .hero__lead {
      max-width: 610px;
      color: var(--text);
      font-size: clamp(1rem, 2vw, 1.18rem);
      line-height: 1.65;
    }

    .hero__actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 6px;
    }

    .btn-main,
    .btn-secondary,
    .btn-confirm {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      padding: 13px 24px;
      border-radius: 999px;
      border: 1.5px solid transparent;
      font-family: var(--font-display);
      font-size: 1.06rem;
      letter-spacing: 0.08em;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.16s ease, background 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
    }

    .btn-main,
    .btn-confirm {
      background: var(--brand);
      color: var(--text-on-brand);
      box-shadow: var(--shadow-sm);
    }

    .btn-main:hover,
    .btn-confirm:hover {
      background: var(--brand-dark);
      transform: translateY(-1px);
      box-shadow: var(--shadow);
    }

    .btn-main--small {
      min-height: 40px;
      padding: 10px 18px;
      font-size: 0.98rem;
    }

    .btn-secondary {
      background: var(--bg-card);
      color: var(--brand);
      border-color: var(--border);
    }

    .btn-secondary:hover {
      border-color: var(--brand);
      background: var(--brand-dim);
    }

    .hero__badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }

    .hero__badges span {
      padding: 7px 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.58);
      border: 1px solid var(--border-soft);
      color: var(--brand-dark);
      font-size: 0.82rem;
      font-weight: 800;
    }

    .hero__visual {
      position: relative;
      min-height: 430px;
      display: grid;
      align-content: center;
    }

    .image-frame {
      position: relative;
      min-height: 180px;
      overflow: hidden;
      border-radius: var(--menu-radius);
      background: var(--bg-elevated);
      border: 1px solid var(--border-soft);
      box-shadow: var(--shadow-sm);
    }

    .image-frame img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-frame--hero {
      min-height: 360px;
      box-shadow: var(--shadow-lg);
    }

    .hero__price-card {
      position: absolute;
      left: -18px;
      bottom: 42px;
      width: min(260px, 72%);
      padding: 16px 18px;
      border-radius: 16px;
      background: var(--brand);
      color: var(--text-on-brand);
      box-shadow: var(--shadow-md);
    }

    .hero__price-card--light {
      left: auto;
      right: -10px;
      bottom: 112px;
      background: var(--bg-card);
      color: var(--brand);
      border: 1px solid var(--border);
    }

    .hero__price-card span,
    .hero__price-card strong {
      display: block;
    }

    .hero__price-card span {
      font-size: 0.78rem;
      font-weight: 800;
      opacity: 0.9;
    }

    .hero__price-card strong {
      margin-top: 2px;
      font-family: var(--font-display);
      font-size: 1.8rem;
      letter-spacing: 0.04em;
    }

    .intro__grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 340px;
      gap: 34px;
      align-items: center;
    }

    .intro h2,
    .intro p {
      margin-top: 10px;
    }

    .intro p {
      max-width: 640px;
      line-height: 1.7;
    }

    .intro__media {
      min-height: 230px;
    }

    .steps__grid,
    .benefits__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }

    .step-card,
    .benefit-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--menu-radius-sm);
      padding: 20px;
      box-shadow: var(--shadow-sm);
    }

    .step-card__num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      margin-bottom: 14px;
      border-radius: 50%;
      background: var(--accent);
      color: var(--brand-dark);
      font-weight: 900;
    }

    .step-card p,
    .benefit-card p {
      margin-top: 8px;
      font-size: 0.92rem;
      line-height: 1.55;
    }

    .logistics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 18px;
    }

    .logistics div {
      padding: 16px;
      border-radius: var(--menu-radius-sm);
      background: var(--accent-dim);
      border: 1px solid rgba(217, 188, 154, 0.48);
    }

    .logistics strong,
    .logistics span {
      display: block;
    }

    .logistics strong {
      color: var(--brand-dark);
      font-size: 0.95rem;
    }

    .logistics span {
      margin-top: 5px;
      color: var(--text-muted);
      font-size: 0.82rem;
    }

    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 350px;
      gap: 28px;
      align-items: start;
      padding: 58px 0;
    }

    .col-main,
    .block {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .block + .block {
      margin-top: 20px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px;
    }

    .weekly-hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 16px;
      align-items: center;
      padding: 18px;
      border-radius: var(--menu-radius);
      background: var(--brand);
      color: var(--text-on-brand);
    }

    .weekly-hero h3 {
      color: inherit;
      font-size: clamp(1.7rem, 3vw, 2.35rem);
      line-height: 0.95;
    }

    .weekly-hero p {
      margin-top: 8px;
      color: rgba(255,255,255,0.86);
    }

    .weekly-hero__prices {
      display: grid;
      grid-template-columns: repeat(2, minmax(96px, 1fr));
      gap: 10px;
    }

    .weekly-hero__prices span {
      display: grid;
      padding: 12px;
      border-radius: 14px;
      background: var(--bg-card);
      color: var(--brand);
      text-align: center;
    }

    .weekly-hero__prices strong {
      font-family: var(--font-display);
      font-size: 1.62rem;
    }

    .product-card {
      display: grid;
      grid-template-columns: 230px minmax(0, 1fr);
      gap: 20px;
      padding: 18px;
      border-radius: var(--menu-radius);
      background: var(--bg-card);
      border: 1.5px solid var(--border);
      box-shadow: var(--shadow-sm);
      animation: fadeUp 0.35s ease both;
    }

    .product-card--veg {
      border-color: rgba(46, 89, 53, 0.28);
    }

    .product-card__media {
      min-height: 100%;
      aspect-ratio: 1 / 1;
      padding: 18px;
    }

    .product-card__media.image-frame {
      padding: 0;
    }

    .product-card__body {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .product-card__top {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: center;
    }

    .tipo-pill,
    .product-card__pack {
      display: inline-flex;
      align-items: center;
      width: max-content;
      padding: 5px 11px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 900;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .tipo-pill {
      background: var(--accent-dim);
      color: var(--brand-dark);
    }

    .tipo-pill--veg {
      background: var(--brand);
      color: var(--text-on-brand);
    }

    .product-card__pack {
      background: var(--bg-elevated);
      color: var(--text-muted);
      border: 1px solid var(--border-soft);
    }

    .meal-list {
      display: grid;
      gap: 6px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .meal-list li {
      position: relative;
      padding-left: 16px;
      color: var(--text);
      font-size: 0.93rem;
      line-height: 1.35;
    }

    .meal-list li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.62em;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--brand);
    }

    .product-card__hint,
    .product-card__obs {
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .size-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: auto;
    }

    .size-option {
      display: grid;
      gap: 8px;
      min-width: 0;
    }

    .size-btn {
      min-height: 46px;
      padding: 11px 12px;
      border-radius: 12px;
      border: 1.5px solid var(--border);
      background: var(--bg-elevated);
      color: var(--brand);
      font-family: var(--font-display);
      font-size: 1rem;
      letter-spacing: 0.06em;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s, color 0.15s, transform 0.15s;
    }

    .size-btn:hover,
    .size-btn--active {
      border-color: var(--brand);
      background: var(--brand);
      color: var(--text-on-brand);
    }

    .size-btn:hover {
      transform: translateY(-1px);
    }

    .qty-control {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 4px;
      border-radius: 999px;
      background: var(--bg-card);
      border: 1px solid var(--border);
    }

    .qty-control button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: none;
      background: var(--brand-dim);
      color: var(--brand);
      cursor: pointer;
      font-size: 1rem;
      font-weight: 900;
      line-height: 1;
    }

    .qty-control button:hover {
      background: var(--brand);
      color: var(--text-on-brand);
    }

    .qty-control span {
      min-width: 22px;
      text-align: center;
      color: var(--text);
      font-weight: 900;
    }

    .qty-control--compact {
      padding: 3px;
      gap: 5px;
    }

    .qty-control--compact button {
      width: 28px;
      height: 28px;
    }

    .catalog-shell,
    .kids-promo {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .catalog-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px;
    }

    .catalog-card {
      display: grid;
      grid-template-columns: minmax(190px, 0.42fr) minmax(0, 1fr);
      overflow: hidden;
      border-radius: var(--menu-radius);
      background: var(--bg-card);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
    }

    .catalog-card__media {
      min-height: 100%;
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }

    .catalog-card__paper {
      min-width: 0;
      padding: 20px;
      background:
        linear-gradient(90deg, rgba(46, 89, 53, 0.025) 1px, transparent 1px),
        linear-gradient(180deg, rgba(217, 188, 154, 0.18), rgba(250, 246, 238, 0.72)),
        #f2dfbd;
      background-size: 18px 18px, auto, auto;
    }

    .catalog-card__banner {
      width: min(100%, 360px);
      margin: 0 auto;
      padding: 12px 16px 10px;
      background: var(--brand);
      color: var(--text-on-brand);
      font-family: var(--font-display);
      font-size: clamp(2rem, 5vw, 3.1rem);
      line-height: 0.95;
      letter-spacing: 0.18em;
      text-align: center;
      text-transform: uppercase;
    }

    .catalog-card__subtitle {
      margin-top: 14px;
      color: var(--bg-card);
      font-size: 1rem;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-align: center;
      text-transform: uppercase;
      text-shadow: 0 1px 2px rgba(46, 31, 20, 0.24);
    }

    .catalog-card__bajada {
      max-width: 480px;
      margin: 8px auto 16px;
      color: rgba(24, 24, 22, 0.72);
      font-size: 0.86rem;
      line-height: 1.45;
      text-align: center;
    }

    .catalog-card__groups {
      display: grid;
      gap: 18px;
    }

    .catalog-group__title {
      margin: 0 0 8px;
      color: var(--bg-card);
      font-size: 0.95rem;
      font-weight: 900;
      letter-spacing: 0.14em;
      text-align: center;
      text-transform: uppercase;
      text-shadow: 0 1px 2px rgba(46, 31, 20, 0.22);
    }

    .catalog-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 10px;
      align-items: center;
      padding: 9px 0;
      border-bottom: 1px solid rgba(46, 31, 20, 0.12);
    }

    .catalog-row:last-child {
      border-bottom: 0;
    }

    .catalog-row__copy {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      min-width: 0;
    }

    .catalog-row__copy span,
    .catalog-row__copy strong {
      color: #10100f;
      font-weight: 950;
      line-height: 1.2;
    }

    .catalog-row__copy span {
      min-width: 0;
      font-size: 0.9rem;
      text-transform: uppercase;
    }

    .catalog-row__copy strong {
      white-space: nowrap;
      font-size: 0.92rem;
    }

    .catalog-row__qty {
      background: rgba(255, 255, 255, 0.64);
    }

    .kids-promo {
      position: relative;
      overflow: hidden;
      margin-top: 6px;
      padding: 28px;
      border-radius: var(--menu-radius);
      background:
        linear-gradient(45deg, transparent 48%, rgba(217, 188, 154, 0.12) 48% 52%, transparent 52%),
        #fbf4e9;
      background-size: 36px 36px, auto;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      text-align: center;
    }

    .kids-promo__top {
      display: grid;
      justify-items: center;
      gap: 8px;
    }

    .kids-promo app-logo {
      display: flex;
      justify-content: center;
      transform: scale(0.72);
      transform-origin: center;
      margin: -12px 0 -8px;
    }

    .kids-promo__tag {
      display: inline-flex;
      padding: 8px 18px 7px;
      border-radius: 5px;
      background: #e8645e;
      color: #fff;
      font-weight: 950;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      transform: rotate(-2deg);
    }

    .kids-promo h2 {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      max-width: 100%;
      padding: 10px 18px 8px;
      border-radius: 999px;
      background: var(--brand);
      color: var(--text-on-brand);
      font-size: clamp(2.2rem, 5vw, 3.8rem);
      letter-spacing: 0.06em;
      text-align: center;
      text-transform: uppercase;
    }

    .kids-promo__lead {
      color: #e8645e;
      font-size: 1rem;
      font-weight: 950;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .kids-promo__features {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 8px;
    }

    .kids-feature {
      display: grid;
      justify-items: center;
      gap: 8px;
      padding: 14px 10px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.58);
      border: 1px solid rgba(46, 89, 53, 0.14);
    }

    .kids-feature span {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background:
        radial-gradient(circle at center, rgba(255,255,255,0.8) 0 28%, transparent 30%),
        var(--brand);
    }

    .kids-feature strong {
      color: var(--brand-dark);
      font-size: 0.82rem;
      line-height: 1.2;
      text-transform: uppercase;
    }

    .kids-feature p {
      color: var(--text);
      font-size: 0.78rem;
      line-height: 1.35;
    }

    .kids-menu {
      position: relative;
      margin-top: 10px;
      padding: 30px 22px 20px;
      border: 2px solid var(--brand);
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.58);
    }

    .kids-menu__label {
      position: absolute;
      top: -18px;
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 18px 6px;
      border-radius: 999px;
      background: var(--brand);
      color: var(--text-on-brand);
      font-family: var(--font-display);
      font-size: 1.35rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .kids-menu__items {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px 26px;
      text-align: left;
    }

    .kids-menu-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 10px;
      align-items: center;
    }

    .kids-menu-row p {
      position: relative;
      padding-left: 18px;
      color: #171615;
      font-size: 0.82rem;
      font-weight: 950;
      line-height: 1.35;
      text-transform: uppercase;
    }

    .kids-menu-row p::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.46em;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #e8645e;
    }

    .kids-menu-row strong {
      display: block;
      margin: 3px 0 0 18px;
      color: var(--brand);
    }

    .kids-promo__bottom {
      display: grid;
      grid-template-columns: 0.9fr 1.25fr 1fr;
      gap: 12px;
      align-items: stretch;
      margin-top: 2px;
    }

    .kids-price,
    .kids-important,
    .kids-cta {
      border-radius: 16px;
      padding: 16px;
    }

    .kids-price {
      display: grid;
      align-content: center;
      justify-items: center;
      background: #e8645e;
      color: #fff;
      text-transform: uppercase;
    }

    .kids-price span,
    .kids-price small {
      color: inherit;
      font-weight: 950;
      letter-spacing: 0.06em;
    }

    .kids-price strong {
      font-family: var(--font-display);
      font-size: clamp(2.4rem, 7vw, 4rem);
      line-height: 0.9;
      letter-spacing: 0.06em;
    }

    .kids-important {
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(46, 89, 53, 0.14);
      text-align: left;
    }

    .kids-important__title {
      color: var(--brand);
      font-weight: 950;
      letter-spacing: 0.12em;
      text-align: center;
      text-transform: uppercase;
    }

    .kids-important div {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(46, 89, 53, 0.12);
    }

    .kids-important strong,
    .kids-important span {
      display: block;
    }

    .kids-important strong {
      color: var(--brand-dark);
      font-size: 0.82rem;
      text-transform: uppercase;
    }

    .kids-important span {
      margin-top: 3px;
      color: var(--text);
      font-size: 0.78rem;
      line-height: 1.35;
    }

    .kids-cta {
      display: grid;
      align-content: center;
      justify-items: start;
      gap: 8px;
      background: rgba(46, 89, 53, 0.08);
      text-align: left;
    }

    .kids-cta strong {
      color: var(--brand);
      font-family: var(--font-display);
      font-size: 1.45rem;
      line-height: 1;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .kids-cta p {
      color: var(--text);
      font-size: 0.86rem;
      line-height: 1.4;
    }

    .kids-cta .btn-main {
      width: 100%;
      padding-inline: 14px;
    }

    .kids-promo__footer {
      margin-top: 0;
      padding: 10px 14px;
      border-radius: 999px;
      background: var(--brand);
      color: var(--text-on-brand);
      font-size: 0.84rem;
      font-weight: 950;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    @media (max-width: 760px) {
      .catalog-card {
        grid-template-columns: 1fr;
      }

      .weekly-hero {
        grid-template-columns: 1fr;
        padding: 18px;
      }

      .weekly-hero__prices {
        grid-template-columns: 1fr 1fr;
      }

      .catalog-card__media {
        min-height: 180px;
        aspect-ratio: 16 / 10;
      }

      .catalog-card__paper {
        padding: 18px 14px;
      }

      .catalog-card__banner {
        font-size: clamp(1.8rem, 12vw, 2.5rem);
        letter-spacing: 0.12em;
      }

      .catalog-row {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .catalog-row__copy {
        align-items: flex-start;
      }

      .catalog-row__qty {
        justify-self: end;
      }

      .kids-promo {
        padding: 22px 14px;
      }

      .kids-promo app-logo {
        transform: scale(0.62);
        margin: -18px 0 -14px;
      }

      .kids-promo h2 {
        border-radius: 18px;
        font-size: clamp(1.65rem, 9vw, 2.5rem);
      }

      .kids-promo__lead {
        font-size: 0.86rem;
        line-height: 1.35;
      }

      .kids-promo__features {
        grid-template-columns: 1fr 1fr;
      }

      .kids-menu {
        padding: 30px 14px 16px;
      }

      .kids-menu__items {
        grid-template-columns: 1fr;
      }

      .kids-promo__bottom {
        grid-template-columns: 1fr;
      }

      .kids-cta {
        justify-items: stretch;
        text-align: center;
      }

      .kids-promo__footer {
        border-radius: 14px;
        font-size: 0.76rem;
        line-height: 1.35;
      }
    }

    @media (max-width: 420px) {
      .kids-promo__features {
        grid-template-columns: 1fr;
      }

      .catalog-row__copy {
        display: grid;
        grid-template-columns: 1fr auto;
      }
    }

    .col-aside {
      position: sticky;
      top: 82px;
    }

    .panel {
      padding: 22px;
      border-radius: var(--menu-radius);
      background: var(--bg-card);
      border: 1.5px solid var(--border);
      box-shadow: var(--shadow-sm);
    }

    .panel--active {
      border-color: var(--brand);
      box-shadow: var(--shadow-md);
    }

    .panel__head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 14px;
    }

    .panel__head h2 {
      font-size: 2rem;
    }

    .panel__clear {
      border: none;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 800;
    }

    .panel__clear:hover {
      color: var(--danger);
    }

    .panel__empty {
      display: grid;
      justify-items: center;
      gap: 8px;
      padding: 28px 10px;
      text-align: center;
    }

    .panel__empty span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 66px;
      height: 38px;
      border-radius: 999px;
      background: var(--accent-dim);
      color: var(--brand);
      font-family: var(--font-display);
      letter-spacing: 0.08em;
    }

    .panel__empty strong {
      color: var(--brand-dark);
    }

    .panel__microcopy,
    .panel__note {
      font-size: 0.86rem;
      line-height: 1.45;
    }

    .panel__section {
      display: grid;
      gap: 8px;
      margin-top: 16px;
    }

    .panel__label {
      color: var(--text-muted);
      font-size: 0.72rem;
      font-weight: 900;
      letter-spacing: 0.13em;
      text-transform: uppercase;
    }

    .panel-item,
    .panel-extra {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 11px;
      border-radius: 12px;
      background: var(--accent-dim);
    }

    .panel-item strong,
    .panel-extra strong {
      color: var(--brand-dark);
      font-size: 0.92rem;
    }

    .panel-item span {
      display: block;
      margin-top: 3px;
      color: var(--text-muted);
      font-size: 0.8rem;
    }

    .panel-item__right {
      display: grid;
      justify-items: end;
      gap: 4px;
      flex-shrink: 0;
    }

    .panel-item__right button {
      border: none;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      font-weight: 900;
    }

    .panel-extra {
      align-items: center;
      background: var(--bg-elevated);
    }

    .panel-extra span {
      color: var(--text);
      font-size: 0.88rem;
      line-height: 1.35;
      min-width: 0;
    }

    .panel__textarea {
      width: 100%;
      min-height: 84px;
      resize: vertical;
      padding: 12px;
      border-radius: 12px;
      border: 1.5px solid var(--border);
      background: var(--bg-elevated);
      color: var(--text);
      font: inherit;
      outline: none;
    }

    .panel__textarea:focus {
      border-color: var(--brand);
      box-shadow: 0 0 0 3px var(--brand-dim);
    }

    .panel__total {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
      margin: 18px 0 14px;
      padding: 16px;
      border-radius: 14px;
      background: var(--brand);
      color: var(--text-on-brand);
    }

    .panel__total span {
      color: inherit;
      font-size: 0.8rem;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .panel__total strong {
      font-family: var(--font-display);
      font-size: 1.8rem;
      letter-spacing: 0.04em;
    }

    .btn-confirm {
      width: 100%;
      border-radius: 14px;
    }

    .btn-confirm:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      transform: none;
    }

    .panel__note {
      margin-top: 9px;
      text-align: center;
    }

    .panel__feedback {
      margin-top: 12px;
      padding: 11px 12px;
      border-radius: 12px;
      background: rgba(179,68,58,0.1);
      color: var(--danger);
      font-weight: 800;
      font-size: 0.86rem;
    }

    .panel__feedback--ok {
      background: var(--brand-dim);
      color: var(--brand);
    }

    .empty {
      display: grid;
      justify-items: center;
      gap: 10px;
      padding: 42px 24px;
      border-radius: var(--menu-radius);
      border: 1.5px dashed var(--border);
      background: var(--bg-card);
      text-align: center;
    }

    .empty__icon {
      color: var(--brand);
      font-family: var(--font-display);
      font-size: 1.3rem;
      letter-spacing: 0.08em;
    }

    .benefits__grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .benefit-card__image {
      min-height: 130px;
      margin-bottom: 16px;
      padding: 12px;
    }

    .benefit-card__image.image-frame {
      padding: 0;
    }

    .site-footer {
      padding: 34px 0 40px;
      background: var(--bg-elevated);
      border-top: 1px solid var(--border-soft);
    }

    .site-footer__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
    }

    .site-footer p {
      margin-top: 8px;
      font-size: 0.9rem;
    }

    .wsp-fab {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 500;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: var(--brand);
      color: var(--text-on-brand);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-lg);
      text-decoration: none;
      transition: transform 0.18s ease, bottom 0.18s ease, background 0.18s ease;
    }

    .wsp-fab:hover {
      background: var(--brand-dark);
      transform: scale(1.06);
    }

    .mobile-summary {
      display: none;
    }

    .product-card--loading {
      min-height: 260px;
    }

    .sk {
      border-radius: 10px;
      background: linear-gradient(90deg, var(--bg-elevated) 25%, rgba(217,188,154,0.3) 50%, var(--bg-elevated) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }

    .sk--image { min-height: 200px; }
    .sk--title { height: 28px; }
    .sk--line { height: 16px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @media (max-width: 980px) {
      .hero__inner {
        min-height: auto;
        max-height: none;
        grid-template-columns: 1fr;
        padding-top: 34px;
      }

      .hero__visual {
        min-height: 360px;
      }

      .intro__grid,
      .layout {
        grid-template-columns: 1fr;
      }

      .steps__grid,
      .logistics {
        grid-template-columns: repeat(2, 1fr);
      }

      .col-aside {
        position: static;
      }
    }

    @media (max-width: 760px) {
      .section-inner {
        width: min(100% - 28px, 1120px);
      }

      .section-band {
        padding: 42px 0;
      }

      .hero__inner {
        width: min(100% - 28px, 1120px);
        gap: 28px;
      }

      h1 {
        font-size: clamp(2.35rem, 13vw, 3.7rem);
      }

      .hero__copy {
        align-items: stretch;
      }

      .hero__actions,
      .hero__badges {
        flex-direction: column;
      }

      .btn-main,
      .btn-secondary {
        width: 100%;
      }

      .hero__visual {
        min-height: auto;
      }

      .hero__price-card,
      .hero__price-card--light {
        position: static;
        width: 100%;
        margin-top: 10px;
      }

      .product-card {
        grid-template-columns: 1fr;
        padding: 14px;
      }

      .product-card__media {
        aspect-ratio: 16 / 9;
      }

      .size-options,
      .benefits__grid {
        grid-template-columns: 1fr;
      }

      .steps__grid,
      .logistics {
        grid-template-columns: 1fr;
      }

      .layout {
        padding: 42px 0 110px;
      }

      .panel {
        scroll-margin-top: 84px;
      }

      .mobile-summary {
        position: fixed;
        left: 14px;
        right: 84px;
        bottom: 14px;
        z-index: 700;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1px;
        min-height: 58px;
        padding: 10px 15px;
        border: none;
        border-radius: 16px;
        background: var(--brand);
        color: var(--text-on-brand);
        box-shadow: var(--shadow-lg);
        cursor: pointer;
      }

      .mobile-summary span {
        color: inherit;
        font-family: var(--font-display);
        font-size: 1rem;
        letter-spacing: 0.08em;
      }

      .mobile-summary strong {
        color: inherit;
        font-size: 0.82rem;
      }

      .wsp-fab {
        right: 14px;
        bottom: 14px;
        width: 58px;
        height: 58px;
      }

      .wsp-fab--raised {
        bottom: 84px;
      }

      .site-footer {
        padding-bottom: 96px;
      }

      .site-footer__inner {
        align-items: flex-start;
        flex-direction: column;
      }
    }

    /* UX repair: escala compacta y responsive más estable */
    .section-inner {
      width: min(1040px, calc(100% - 32px));
    }

    .section-band {
      padding: 34px 0;
    }

    h1 {
      max-width: 560px;
      font-size: clamp(2rem, 4.2vw, 3.55rem);
      line-height: 1.02;
      text-wrap: balance;
    }

    h2 {
      font-size: clamp(1.7rem, 2.8vw, 2.45rem);
    }

    .hero__inner {
      width: min(1040px, calc(100% - 32px));
      min-height: auto;
      max-height: none;
      grid-template-columns: minmax(0, 1fr) 390px;
      gap: 32px;
      padding: 48px 0 38px;
    }

    .hero__copy {
      gap: 13px;
    }

    .hero__lead {
      max-width: 560px;
      font-size: 1rem;
      line-height: 1.55;
    }

    .hero__visual {
      min-height: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      align-content: start;
    }

    .image-frame--hero {
      grid-column: 1 / -1;
      min-height: 220px;
      box-shadow: var(--shadow);
    }

    .hero__price-card,
    .hero__price-card--light {
      position: static;
      width: auto;
      margin: 0;
      padding: 13px 14px;
      border-radius: 12px;
      box-shadow: var(--shadow-sm);
    }

    .hero__price-card strong {
      font-size: 1.4rem;
    }

    .hero__price-card span {
      font-size: 0.72rem;
    }

    .intro__grid {
      grid-template-columns: minmax(0, 1fr) 280px;
      gap: 24px;
    }

    .intro__media {
      min-height: 150px;
    }

    .steps__grid,
    .logistics {
      gap: 10px;
    }

    .step-card,
    .benefit-card {
      padding: 16px;
    }

    .layout {
      grid-template-columns: minmax(0, 1fr) 318px;
      gap: 22px;
      padding: 40px 0;
    }

    .product-card {
      grid-template-columns: 190px minmax(0, 1fr);
      gap: 18px;
      padding: 18px;
    }

    .product-card__media {
      min-height: 190px;
      padding: 12px;
    }

    .product-card__media.image-frame {
      padding: 0;
    }

    .product-card__body {
      gap: 12px;
    }

    .product-card h3 {
      font-size: 1.42rem;
    }

    .tipo-pill,
    .product-card__pack {
      padding: 4px 9px;
      font-size: 0.7rem;
    }

    .meal-list {
      gap: 5px;
    }

    .meal-list li {
      font-size: 0.94rem;
      line-height: 1.38;
    }

    .size-options {
      gap: 8px;
    }

    .size-btn {
      min-height: 44px;
      padding: 10px 10px;
      font-size: 0.92rem;
      letter-spacing: 0.05em;
    }

    .panel {
      padding: 16px;
    }

    .panel__head h2 {
      font-size: 1.55rem;
    }

    .panel__empty {
      padding: 20px 8px;
    }

    .panel__section {
      margin-top: 12px;
    }

    .panel__textarea {
      min-height: 72px;
    }

    .panel__total {
      margin: 14px 0 12px;
      padding: 13px;
    }

    .panel__total strong {
      font-size: 1.45rem;
    }

    .benefit-card__image {
      min-height: 88px;
      margin-bottom: 12px;
    }

    @media (max-width: 980px) {
      .hero__inner {
        grid-template-columns: 1fr;
        gap: 22px;
        padding-top: 34px;
      }

      .hero__visual {
        grid-template-columns: 1fr 1fr;
      }

      .intro__grid,
      .layout {
        grid-template-columns: 1fr;
      }

      .col-aside {
        position: static;
      }
    }

    @media (max-width: 760px) {
      .section-inner,
      .hero__inner {
        width: min(100% - 24px, 1040px);
      }

      .section-band {
        padding: 28px 0;
      }

      h1 {
        font-size: clamp(2rem, 11vw, 3rem);
        text-align: left;
      }

      h2 {
        font-size: clamp(1.55rem, 8vw, 2.2rem);
      }

      .hero__inner {
        padding: 28px 0 28px;
      }

      .hero__copy {
        align-items: stretch;
      }

      .hero__visual,
      .steps__grid,
      .logistics,
      .benefits__grid {
        grid-template-columns: 1fr;
      }

      .image-frame--hero {
        min-height: 170px;
      }

      .hero__price-card,
      .hero__price-card--light {
        width: 100%;
      }

      .intro__grid {
        grid-template-columns: 1fr;
      }

      .product-card {
        grid-template-columns: 1fr;
      }

      .product-card__media {
        min-height: 130px;
        aspect-ratio: auto;
      }

      .product-card__media.image-frame {
        min-height: 170px;
      }

      .product-card__top {
        align-items: flex-start;
      }

      .size-options {
        grid-template-columns: 1fr;
      }

      .layout {
        padding: 34px 0 110px;
      }

      .mobile-summary {
        left: 12px;
        right: 78px;
        bottom: 12px;
        min-height: 54px;
        padding: 9px 13px;
      }

      .wsp-fab {
        right: 12px;
        bottom: 12px;
        width: 54px;
        height: 54px;
      }

      .wsp-fab--raised {
        bottom: 78px;
      }
    }
  `]
})
export class MenuComponent implements OnInit {
  private readonly DRAFT_KEY = 'nt_pedido_draft';

  foodImages = FOOD_IMAGES;
  catalogSections = CATALOG_SECTIONS;
  kidsFeatures = KIDS_FEATURES;
  kidsMenuItems = KIDS_MENU_ITEMS;
  kidsImportant = KIDS_IMPORTANT;

  viandas = signal<Vianda[]>([]);
  viandas_sel = signal<ViandaSeleccionada[]>([]);
  loading = signal(true);
  loadingPedido = signal(false);
  feedbackMsg = signal('');
  feedbackOk = signal(false);
  observaciones = '';
  extras: Record<string, number> = {};

  constructor(
    private viandaService: ViandaService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.viandaService.getAll(true).subscribe({
      next: v => {
        this.viandas.set(v);
        this.restoreDraft(v);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  saveDraft(): void {
    const draft: PedidoDraft = {
      viandas: this.viandas_sel().map(vs => ({
        viandaId: vs.vianda.id,
        tamano: vs.tamano,
        cantidad: vs.cantidad,
      })),
      extras: this.extras,
      observaciones: this.observaciones,
    };
    localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draft));
  }

  private restoreDraft(viandasDisponibles: Vianda[]): void {
    try {
      const raw = localStorage.getItem(this.DRAFT_KEY);
      if (!raw) return;

      const draft = JSON.parse(raw) as PedidoDraft;
      const restauradas: ViandaSeleccionada[] = (draft.viandas ?? [])
        .map(item => {
          const vianda = viandasDisponibles.find(v => v.id === item.viandaId);
          if (!vianda || item.cantidad <= 0) return null;
          return { vianda, tamano: item.tamano, cantidad: item.cantidad } as ViandaSeleccionada;
        })
        .filter((item): item is ViandaSeleccionada => item !== null);

      if (restauradas.length > 0) this.viandas_sel.set(restauradas);
      this.extras = draft.extras ?? {};
      this.observaciones = draft.observaciones ?? '';
    } catch {
      localStorage.removeItem(this.DRAFT_KEY);
    }
  }

  scrollAlMenu(): void {
    document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollAlPanel(): void {
    document.querySelector('#pedido')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  hayPedido(): boolean {
    return this.viandas_sel().length > 0 || this.tieneExtras();
  }

  setTamano(v: Vianda, tamano: PedidoTamano): void {
    const existing = this.viandas_sel().find(vs => vs.vianda.id === v.id && vs.tamano === tamano);

    if (existing) {
      this.viandas_sel.update(list =>
        list.map(vs => vs.vianda.id === v.id && vs.tamano === tamano
          ? { ...vs, cantidad: vs.cantidad + 1 }
          : vs
        )
      );
    } else {
      this.viandas_sel.update(list => [...list, { vianda: v, tamano, cantidad: 1 }]);
    }

    this.feedbackMsg.set('');
    this.saveDraft();
  }

  getCantidadPorTamano(v: Vianda, tamano: PedidoTamano): number {
    return this.viandas_sel().find(vs => vs.vianda.id === v.id && vs.tamano === tamano)?.cantidad ?? 0;
  }

  cambiarCantidadPorTamano(v: Vianda, tamano: PedidoTamano, delta: number): void {
    this.viandas_sel.update(list => {
      const idx = list.findIndex(vs => vs.vianda.id === v.id && vs.tamano === tamano);
      if (idx === -1) return list;

      const newCant = list[idx].cantidad + delta;
      if (newCant <= 0) return list.filter((_, i) => i !== idx);

      return list.map((vs, i) => i === idx ? { ...vs, cantidad: newCant } : vs);
    });
    this.saveDraft();
  }

  quitarViandaEspecifica(v: Vianda, tamano: PedidoTamano): void {
    this.viandas_sel.update(list =>
      list.filter(vs => !(vs.vianda.id === v.id && vs.tamano === tamano))
    );
    this.saveDraft();
  }

  extraKey(tipo: ExtraTipo, sabor: string): string {
    return tipo + ':' + sabor;
  }

  incrementar(tipo: ExtraTipo, sabor: string): void {
    const key = this.extraKey(tipo, sabor);
    this.extras = { ...this.extras, [key]: (this.extras[key] ?? 0) + 1 };
    this.feedbackMsg.set('');
    this.saveDraft();
  }

  decrementar(tipo: ExtraTipo, sabor: string): void {
    const key = this.extraKey(tipo, sabor);
    const cur = this.extras[key] ?? 0;
    if (cur <= 0) return;

    const next = { ...this.extras };
    if (cur === 1) delete next[key];
    else next[key] = cur - 1;

    this.extras = next;
    this.saveDraft();
  }

  quitarExtra(extra: ExtraItem): void {
    const key = this.extraKey(extra.tipo, extra.sabor);
    if (!(key in this.extras)) return;

    const next = { ...this.extras };
    delete next[key];
    this.extras = next;
    this.saveDraft();
  }

  tieneExtras(): boolean {
    return Object.values(this.extras).some(v => v > 0);
  }

  extrasSeleccionados(): ExtraItem[] {
    return Object.entries(this.extras)
      .filter(([, cant]) => cant > 0)
      .map(([key, cant]): ExtraItem | null => {
        const separator = key.indexOf(':');
        if (separator <= 0) return null;
        const tipo = key.slice(0, separator) as ExtraTipo;
        const sabor = key.slice(separator + 1);
        if (!this.isExtraTipo(tipo)) return null;
        const catalogItem = this.findCatalogItem(tipo, sabor);
        return {
          id: key,
          tipo,
          sabor,
          precio: catalogItem?.precio ?? this.fallbackExtraPrice(tipo),
          cantidad: cant,
        };
      })
      .filter((item): item is ExtraItem => item !== null);
  }

  extraLabel(tipo: ExtraTipo): string {
    if (tipo === 'empanada') return 'Empanadas';
    if (tipo === 'tarta') return 'Tarta';
    if (tipo === 'kids') return 'Kids & Teens';
    return 'Pizza';
  }

  private isExtraTipo(tipo: string): tipo is ExtraTipo {
    return tipo === 'empanada' || tipo === 'pizza' || tipo === 'tarta' || tipo === 'kids';
  }

  private findCatalogItem(tipo: ExtraTipo, sabor: string): CatalogProduct | undefined {
    if (tipo === 'kids') {
      return this.kidsMenuItems.find(item => item.nombre === sabor);
    }

    return this.catalogSections
      .find(section => section.tipo === tipo)
      ?.groups.flatMap(group => group.items)
      .find(item => item.nombre === sabor);
  }

  private fallbackExtraPrice(tipo: ExtraTipo): number {
    if (tipo === 'kids') return KIDS_PRICE;
    if (tipo === 'tarta') return 15000;
    return 10000;
  }

  totalPacks(): number {
    return this.viandas_sel().reduce((sum, vs) => sum + vs.cantidad, 0);
  }

  totalEstimado(): number {
    const viandasTotal = this.viandas_sel()
      .reduce((sum, vs) => sum + this.priceFor(vs.tamano) * vs.cantidad, 0);

    const extrasTotal = this.extrasSeleccionados()
      .reduce((sum, e) => sum + e.precio * e.cantidad, 0);

    return viandasTotal + extrasTotal;
  }

  cancelar(): void {
    this.viandas_sel.set([]);
    this.extras = {};
    this.observaciones = '';
    this.feedbackMsg.set('');
    this.feedbackOk.set(false);
    localStorage.removeItem(this.DRAFT_KEY);
  }

  confirmar(): void {
    if (!this.hayPedido()) return;

    this.loadingPedido.set(true);
    this.feedbackMsg.set('');
    window.open(this.whatsappPedidoUrl(), '_blank');
    this.loadingPedido.set(false);
    this.feedbackOk.set(true);
    this.feedbackMsg.set('Te abrimos WhatsApp con el pedido armado. Para finalizar, enviá el mensaje.');
    this.saveDraft();
  }

  consultaWhatsappUrl(): string {
    const mensaje = 'Hola Not Tupper! Quiero consultar por las viandas freezadas.';
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensaje)}`;
  }

  kidsWhatsappUrl(): string {
    const mensaje = 'Hola Not Tupper! Quiero consultar por el menú Kids & Teens.';
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensaje)}`;
  }

  whatsappPedidoUrl(): string {
    const u = this.auth.user();
    const lines: string[] = [
      'Pedido Not Tupper',
      '',
      'Hola! Quiero hacer este pedido de viandas freezadas:',
      '',
    ];

    if (u) {
      const nombre = [u.nombre, u.apellido].filter(Boolean).join(' ').trim();
      if (nombre) lines.push(`Cliente: ${nombre}`);
      if (u.zona) lines.push(`Zona: ${u.zona}`);
      if (u.celular) lines.push(`Celular: ${u.celular}`);
      lines.push('');
    }

    const sel = this.viandas_sel();
    if (sel.length > 0) {
      lines.push('Viandas:');
      sel.forEach(vs => {
        const tipo = vs.vianda.tipo === 'COMUN' ? 'Común' : 'Vegetariana';
        lines.push(`- ${vs.cantidad}x ${displayCleanName(this.displayMenuName(vs.vianda))} (${tipo}) · ${this.tamanoLabel(vs.tamano)} · ${this.formatPrice(this.priceFor(vs.tamano) * vs.cantidad)}`);
      });
      lines.push('');
    }

    const extras = this.extrasSeleccionados();
    if (extras.length > 0) {
      lines.push('Extras:');
      extras.forEach(e => {
        const label = this.extraLabel(e.tipo);
        lines.push(`- ${e.cantidad}x ${label} ${e.sabor} · ${this.formatPrice(e.precio * e.cantidad)}`);
      });
      lines.push('');
    }

    if (this.observaciones.trim()) {
      lines.push(`Observaciones: ${this.observaciones.trim()}`);
      lines.push('');
    }

    lines.push(`Total estimado: ${this.formatPrice(this.totalEstimado())}`);
    lines.push('');
    lines.push('El pedido se confirma al enviar este mensaje.');

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  displayMenuName(v: Vianda): string {
    const raw = (v.nombre ?? '').trim();
    const range = raw.match(/^(\d{1,2})\s*[-/]\s*(\d{1,2})$/);
    if (range) {
      const tipo = v.tipo === 'VEGETARIANA' ? 'vegetariano' : 'común';
      return `Menú ${tipo} del ${range[1]} al ${range[2]}`;
    }
    if (/^\d{1,2}$/.test(raw)) return `Menú semanal ${raw}`;
    if (!raw) return v.tipo === 'VEGETARIANA' ? 'Menú vegetariano semanal' : 'Menú común semanal';
    return raw;
  }

  productImage(v: Vianda): string {
    return v.tipo === 'VEGETARIANA' ? this.foodImages.vegPack : this.foodImages.commonPack;
  }

  tamanoLabel(tamano: PedidoTamano): string {
    return tamano === 'CHICA' ? '300g' : '500g';
  }

  priceFor(tamano: PedidoTamano): number {
    return tamano === 'CHICA' ? 35000 : 45000;
  }

  formatPrice(value: number): string {
    return '$' + value.toLocaleString('es-AR');
  }
}

function displayCleanName(name: string): string {
  return name.replace(/\s+/g, ' ').trim();
}
