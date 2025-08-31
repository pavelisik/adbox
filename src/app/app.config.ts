import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';

import { providePrimeNG } from 'primeng/config';
import { MyPreset } from './mypreset';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        providePrimeNG({
            theme: {
                preset: MyPreset,
                options: {
                    prefix: 'p',
                    cssLayer: {
                        name: 'primeng',
                        order: 'app-styles, primeng, another-css-library',
                    },
                },
            },
        }),
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
    ],
};
