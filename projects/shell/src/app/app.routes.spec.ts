import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { appRoutes, LoadRemote } from './app.routes';

@Component({ template: '<p>remote catalog</p>' })
class FakeCatalog {}

async function openHome(loadRemote: LoadRemote): Promise<HTMLElement> {
  TestBed.configureTestingModule({ providers: [provideRouter(appRoutes(loadRemote))] });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl('/');
  return harness.routeNativeElement as HTMLElement;
}

describe('shell routes', () => {
  it('redirects to the catalog and renders the routes exposed by the remote', async () => {
    const loadRemote = vi.fn().mockResolvedValue({
      CATALOG_ROUTES: [{ path: '', component: FakeCatalog }],
    });

    const view = await openHome(loadRemote);

    expect(loadRemote).toHaveBeenCalledWith('catalog', './routes');
    expect(view.textContent).toContain('remote catalog');
  });

  it('shows a fallback instead of breaking the shell when the remote is down', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const view = await openHome(vi.fn().mockRejectedValue(new Error('remote offline')));

    expect(view.querySelector('[role="alert"]')?.textContent).toContain(
      'The catalog is temporarily unavailable',
    );
    expect(error).toHaveBeenCalled();
  });
});
