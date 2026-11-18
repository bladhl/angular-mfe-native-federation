import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ADD_TO_CART, Product } from '../../../contracts/cart-events';
import { App } from './app';

const add = (product: Product) =>
  window.dispatchEvent(new CustomEvent(ADD_TO_CART, { detail: product }));

describe('App (shell)', () => {
  it('updates the cart summary when a remote dispatches add-to-cart', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const summary = () => fixture.nativeElement.querySelector('output').textContent;
    expect(summary()).toContain('Items in cart: 0 · Total: $0.00');

    add({ id: 1, name: 'Monitor', price: 120 });
    add({ id: 2, name: 'Mechanical keyboard', price: 85 });
    await fixture.whenStable();

    expect(summary()).toContain('Items in cart: 2 · Total: $205.00');
  });
});
