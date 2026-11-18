import { TestBed } from '@angular/core/testing';
import { ADD_TO_CART, Product } from '../../../contracts/cart-events';
import { ProductList } from './product-list';

describe('ProductList', () => {
  it('announces the selected product to the host through an add-to-cart event', async () => {
    const fixture = TestBed.createComponent(ProductList);
    await fixture.whenStable();
    const received: Product[] = [];
    const listener = (event: Event) => received.push((event as CustomEvent<Product>).detail);
    window.addEventListener(ADD_TO_CART, listener);

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();
    window.removeEventListener(ADD_TO_CART, listener);

    expect(buttons.length).toBe(3);
    expect(received).toEqual([{ id: 2, name: 'Mechanical keyboard', price: 85 }]);
  });
});
