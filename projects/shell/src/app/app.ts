import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterOutlet } from '@angular/router';
import { fromEvent, scan } from 'rxjs';
import { ADD_TO_CART, Product } from '../../../contracts/cart-events';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, RouterLink, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <strong>Shell <small>(host · port 4200)</small></strong>
      <a routerLink="/catalog">Catalog</a>
      <output aria-live="polite"
        >Items in cart: {{ count() }} · Total: {{ total() | currency: 'USD' }}</output
      >
    </header>
    <main><router-outlet /></main>
  `,
})
export class App {
  // Remotes talk to the shell through a browser event: RxJS turns it into a stream
  // and toSignal() exposes the accumulated cart to the template.
  private readonly cart = toSignal(
    fromEvent<CustomEvent<Product>>(window, ADD_TO_CART).pipe(
      scan((items, event) => [...items, event.detail], [] as Product[]),
    ),
    { initialValue: [] },
  );

  protected readonly count = computed(() => this.cart().length);
  protected readonly total = computed(() =>
    this.cart().reduce((sum, product) => sum + product.price, 0),
  );
}
