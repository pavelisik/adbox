import { Routes } from '@angular/router';
import { canActivateAuth } from '@app/core/guards';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@app/shared/layouts').then((m) => m.MainLayout),
        children: [
            {
                path: '',
                data: { isMain: true },
                loadComponent: () => import('@app/pages').then((m) => m.AdvertsList),
            },
            {
                path: 'adverts',
                loadComponent: () => import('@app/pages').then((m) => m.AdvertsList),
            },
            {
                path: 'advert/:id',
                loadComponent: () => import('@app/pages').then((m) => m.Advert),
            },
            {
                path: 'user',
                canActivate: [canActivateAuth],
                children: [
                    {
                        path: 'adverts',
                        data: { isUserAdverts: true },
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
                ],
            },
            {
                path: '**',
                loadComponent: () => import('@app/pages').then((m) => m.NotFound),
            },
        ],
    },
];
