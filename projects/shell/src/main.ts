import { initFederation } from '@angular-architects/native-federation';

// Reads the manifest, registers the remotes and shared dependencies,
// then hands the remote loader to the app.
initFederation('federation.manifest.json', {
  hostRemoteEntry: { url: './remoteEntry.json' },
})
  .then((federation) => import('./bootstrap').then((m) => m.bootstrap(federation.loadRemoteModule)))
  .catch((err) => console.error(err));
