import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations'
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideAnimations(),
    /**
     * REQUIRED FROM PrimeNG 18 ONWARDS (this package now peers on PrimeNG 21).
     * PrimeNG no longer ships a static theme stylesheet; every component is
     * styled from design tokens registered here. Without providePrimeNG() the
     * PrimeNG-based fields (dialogs, buttons, inputs, selects, date pickers,
     * multi-selects, toasts…) render unstyled. Swap `Aura` for whichever
     * @primeuix/themes preset matches your product.
     */
    providePrimeNG({ theme: { preset: Aura } })
  ]
};
