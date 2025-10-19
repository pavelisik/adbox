import { Routes } from '@angular/router';
import { canActivateAuth, redirectMyUser } from '@app/core/guards';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@app/shared/layouts').then((m) => m.MainLayout),
        children: [
            {
                path: '',
                data: { pageType: 'main' },
                loadComponent: () => import('@app/pages').then((m) => m.AdvertsList),
            },
            {
                path: 'adverts',
                data: { pageType: 'search' },
                loadComponent: () => import('@app/pages').then((m) => m.AdvertsList),
            },
            {
                path: 'advert/:id',
                loadComponent: () => import('@app/pages').then((m) => m.Advert),
            },
            {
                path: 'users/:id',
                canActivate: [redirectMyUser],
                data: { pageType: 'user-adverts' },
                loadComponent: () => import('@app/pages').then((m) => m.AdvertsList),
            },

            {
                path: 'user',
                canActivate: [canActivateAuth],
                children: [
                    {
                        path: 'adverts',
                        data: { pageType: 'my-adverts' },
                        loadComponent: () => import('@app/pages').then((m) => m.AdvertsList),
                    },
                    {
                        path: 'settings',
                        loadComponent: () => import('@app/pages').then((m) => m.Settings),
                    },
                    {
                        path: 'advert-add',
                        loadComponent: () => import('@app/pages').then((m) => m.AdvertAdd),
                    },
                    {
                        path: 'advert-edit/:id',
                        loadComponent: () => import('@app/pages').then((m) => m.AdvertEdit),
                    },
                ],
            },
            {
                path: '**',
                loadComponent: () => import('@app/pages').then((m) => m.NotFound),
            },
        ],
    },
];
