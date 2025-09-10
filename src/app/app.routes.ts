import { Routes } from '@angular/router';
import { canActivateAuth } from '@app/core/guards';
import { MainLayout } from '@app/shared/layouts';
import {
    AdvertsList,
    Advert,
    AdvertAdd,
    NotFound,
    UserProfile,
    Search,
    Settings,
} from '@app/pages';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            { path: '', component: AdvertsList },
            { path: 'advert/:id', component: Advert },
            { path: 'search', component: Search },
            {
                path: 'user',
                canActivate: [canActivateAuth],
                children: [
                    { path: 'profile', component: UserProfile },
                    { path: 'settings', component: Settings },
                    { path: 'advert-add', component: AdvertAdd },
                ],
            },
            { path: '**', component: NotFound },
        ],
    },
];
