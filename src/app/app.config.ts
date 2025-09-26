import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { PrimePreset } from '@app/prime-preset';
import { MessageService } from 'primeng/api';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor, httpErrorInterceptor } from '@app/core/interceptors';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: PrimePreset,
                options: {
                    prefix: 'p',
                    darkModeSelector: false || 'none',
                    cssLayer: true,
                },
            },
        }),
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(withInterceptors([authTokenInterceptor, httpErrorInterceptor])),
        MessageService,
    ],
};
