import { Routes } from '@angular/router';
import { canActivateAuth } from '@app/core/guards/auth.guard';
import { MainLayout } from '@app/layouts/main-layout/main-layout';
import { AdvertsList } from '@app/pages/adverts-list/adverts-list';
import { Advert } from '@app/pages/advert/advert';
import { AdvertAdd } from '@app/pages/advert-add/advert-add';
import { NotFound } from '@app/pages/not-found/not-found';
import { UserProfile } from '@app/pages/user-profile/user-profile';
import { Search } from '@app/pages/search/search';
import { Settings } from '@app/pages/settings/settings';

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
