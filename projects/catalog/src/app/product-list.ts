import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ADD_TO_CART, Product } from '../../../contracts/cart-events';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Catalog <small>(remote · port 4201)</small></h2>
    <ul>
      @for (product of products; track product.id) {
        <li>
          <span>{{ product.name }} · {{ product.price | currency: 'USD' }}</span>
          <button type="button" (click)="addToCart(product)">Add to cart</button>
        </li>
      }
    </ul>
  `,
})
export class ProductList {
  protected readonly products: readonly Product[] = [
    { id: 1, name: 'Monitor', price: 120 },
    { id: 2, name: 'Mechanical keyboard', price: 85 },
    { id: 3, name: 'Wireless mouse', price: 30 },
  ];

  protected addToCart(product: Product): void {
    window.dispatchEvent(new CustomEvent<Product>(ADD_TO_CART, { detail: product }));
  }
}
