import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { LoadRemote } from './app/app.routes';

export const bootstrap = (loadRemote: LoadRemote) =>
  bootstrapApplication(App, appConfig(loadRemote));
