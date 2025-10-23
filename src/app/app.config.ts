import {
    ApplicationConfig,
    inject,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { PrimePreset } from '@app/prime-preset';
import { MessageService, ConfirmationService } from 'primeng/api';
import { provideRouter, TitleStrategy, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    authTokenInterceptor,
    httpErrorsInterceptor,
    imagesCacheInterceptor,
} from '@app/core/interceptors';
import { AppTitleStrategy } from '@app/core/title';
import { AuthFacade } from '@app/core/auth/services';

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
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
            }),
        ),
        provideHttpClient(
            withInterceptors([authTokenInterceptor, imagesCacheInterceptor, httpErrorsInterceptor]),
        ),
        MessageService,
        ConfirmationService,
        { provide: TitleStrategy, useClass: AppTitleStrategy },
        provideAppInitializer(() => {
            const auth = inject(AuthFacade);
            auth.initFromCookie();
        }),
    ],
};
