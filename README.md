# Angular microfrontends with Native Federation

A minimal host + remote setup with Angular 22 and
[Native Federation](https://www.npmjs.com/package/@angular-architects/native-federation).
The shell loads the catalog's routes at runtime, the two apps communicate
without importing each other, and the shell keeps working when the remote is down.

```text
 shell (host, :4200)                         catalog (remote, :4201)
 ┌──────────────────────────────┐            ┌──────────────────────────┐
 │ header: cart summary (signal)│◄── event ──│ ProductList              │
 │ /catalog ── loadRemote() ────┼── HTTP ───►│ exposes './routes'       │
 │ fallback if remote is down   │            │ (runs standalone too)    │
 └──────────────────────────────┘            └──────────────────────────┘
        federation.manifest.json → http://localhost:4201/remoteEntry.json
```

## Run it

```bash
pnpm install
pnpm start:catalog   # terminal 1: remote on http://localhost:4201
pnpm start:shell     # terminal 2: host on http://localhost:4200
```

Stop the catalog and reload the shell to see the fallback.

```bash
pnpm test     # Vitest unit tests for both apps
pnpm build    # production builds in dist/
```

GitHub Actions runs format check, tests and builds on every push
(`.github/workflows/ci.yml`).

## Design decisions

| Decision                                               | Where                                            | Why                                                                                                                                                                                                                                           |
| ------------------------------------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dynamic host with a manifest                           | `projects/shell/public/federation.manifest.json` | Remote URLs change per environment without rebuilding the shell.                                                                                                                                                                              |
| Remote exposes routes, not a component                 | `projects/catalog/federation.config.mjs`         | The remote owns its own navigation; the shell only mounts it under `/catalog`.                                                                                                                                                                |
| Shared dependencies as singletons with `strictVersion` | `federation.config.mjs` (both)                   | One Angular runtime in the page; a version mismatch fails loudly instead of silently.                                                                                                                                                         |
| Communication through a `CustomEvent`                  | `projects/contracts/cart-events.ts`              | The event name and payload type are the only contract. Each app compiles it into its own bundle, so there is no runtime coupling.                                                                                                             |
| RxJS stream exposed as a signal                        | `projects/shell/src/app/app.ts`                  | `fromEvent` + `scan` build the cart; `toSignal` and `computed` feed the template.                                                                                                                                                             |
| Loader passed into the routes                          | `projects/shell/src/app/app.routes.ts`           | Routes depend on a small `LoadRemote` type, not on the library (dependency inversion), so tests use a fake loader. Uses the loader returned by `initFederation()`, since the global `loadRemoteModule` is deprecated in Native Federation v4. |
| Fallback route on load failure                         | `projects/shell/src/app/remote-unavailable.ts`   | A failing remote degrades one section instead of breaking the whole shell.                                                                                                                                                                    |

## Tests

- `product-list.spec.ts`: clicking a product dispatches `add-to-cart` with that product.
- `app.spec.ts`: the shell's cart summary reacts to `add-to-cart` events.
- `app.routes.spec.ts`: `/` redirects to the remote's routes, and a rejected load renders the fallback.

## Limits

Both apps live in one workspace for convenience. In a real setup each team would
own a separate repository and pipeline, and the shared contract would be a
versioned package.
