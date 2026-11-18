// Contract shared by the shell and the catalog remote.
// Both apps compile it into their own bundle, so neither imports the other at runtime.
export const ADD_TO_CART = 'add-to-cart';

export interface Product {
  id: number;
  name: string;
  price: number;
}
