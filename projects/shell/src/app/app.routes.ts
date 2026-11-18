import { Routes } from '@angular/router';
import { RemoteUnavailable } from './remote-unavailable';

// Same shape as the loader returned by Native Federation's initFederation().
// Depending on this type instead of the library keeps the routes testable.
export type LoadRemote = <T>(remoteName: string, exposedModule: string) => Promise<T>;

export const appRoutes = (loadRemote: LoadRemote): Routes => [
  { path: '', pathMatch: 'full', redirectTo: 'catalog' },
  {
    path: 'catalog',
    loadChildren: () =>
      loadRemote<{ CATALOG_ROUTES: Routes }>('catalog', './routes')
        .then((remote) => remote.CATALOG_ROUTES)
        .catch((error: unknown): Routes => {
          console.error(error);
          return [{ path: '**', component: RemoteUnavailable }];
        }),
  },
];
