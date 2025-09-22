import { Routes } from '@angular/router';
import { canActivateAuth, canActivatePublic } from '@app/core/guards';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@app/shared/layouts').then((m) => m.MainLayout),
        canActivate: [canActivatePublic],
        children: [
            {
                path: '',
                data: { isMain: true },
                loadComponent: () => import('@app/pages').then((m) => m.AdvertsList),
                canActivate: [canActivatePublic],
            },
            {
                path: 'adverts',
                loadComponent: () => import('@app/pages').then((m) => m.AdvertsList),
                canActivate: [canActivatePublic],
            },
            {
                path: 'advert/:id',
                loadComponent: () => import('@app/pages').then((m) => m.Advert),
                canActivate: [canActivatePublic],
            },
            {
                path: 'user',
                canActivate: [canActivateAuth],
                children: [
                    {
                        path: 'profile',
                        loadComponent: () => import('@app/pages').then((m) => m.UserProfile),
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
                canActivate: [canActivatePublic],
            },
        ],
    },
];
