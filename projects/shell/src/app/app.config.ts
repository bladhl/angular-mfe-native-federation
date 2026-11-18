import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes, LoadRemote } from './app.routes';

export const appConfig = (loadRemote: LoadRemote): ApplicationConfig => ({
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(appRoutes(loadRemote))],
});
