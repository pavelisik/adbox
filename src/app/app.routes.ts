import { Routes } from '@angular/router';
import { canActivateAuth, redirectMyUser } from '@app/core/guards';

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
                path: 'users/:id',
                canActivate: [redirectMyUser],
                data: { isUserAdverts: true },
                loadComponent: () => import('@app/pages').then((m) => m.AdvertsList),
            },

            {
                path: 'user',
                canActivate: [canActivateAuth],
                children: [
                    {
                        path: 'adverts',
                        data: { isMyAdverts: true },
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
