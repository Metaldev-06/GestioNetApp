import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  ApplicationConfig,
  LOCALE_ID,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import localeEsAR from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';

import { routes } from './app.routes';

registerLocaleData(localeEsAR);

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
    provideExperimentalZonelessChangeDetection(),
    provideAnimations(),
    provideHttpClient(),
    {
      provide: LOCALE_ID,
      useValue: 'es-AR',
    },
    NG_EVENT_PLUGINS,
  ],
};
