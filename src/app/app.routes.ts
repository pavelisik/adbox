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
                        title: 'Мои объявления',
                    },
                    {
                        path: 'favorites',
                        data: { pageType: 'favorites' },
                        loadComponent: () => import('@app/pages').then((m) => m.AdvertsList),
                        title: 'Избранные объявления',
                    },
                    {
                        path: 'settings',
                        loadComponent: () => import('@app/pages').then((m) => m.Settings),
                        title: 'Настройки пользователя',
                    },
                    {
                        path: 'advert-add',
                        loadComponent: () => import('@app/pages').then((m) => m.AdvertAdd),
                        title: 'Размещение объявления',
                    },
                    {
                        path: 'advert-edit/:id',
                        loadComponent: () => import('@app/pages').then((m) => m.AdvertEdit),
                        title: 'Редактирование объявления',
                    },
                ],
            },
            {
                path: '**',
                loadComponent: () => import('@app/pages').then((m) => m.NotFound),
                title: 'Страница не найдена',
            },
        ],
    },
];
