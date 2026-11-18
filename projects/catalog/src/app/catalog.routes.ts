import { Routes } from '@angular/router';
import { ProductList } from './product-list';

// Exposed to the shell as './routes' (see federation.config.mjs).
export const CATALOG_ROUTES: Routes = [{ path: '', component: ProductList }];
