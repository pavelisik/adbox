import { Routes } from '@angular/router';
import { canActivateAuth } from '@app/core/guards/auth.guard';
import { MainLayout } from '@app/layouts/main-layout/main-layout';
import { AdvertsList } from '@app/presentation/pages/adverts-list/adverts-list';
import { Advert } from '@app/presentation/pages/advert/advert';
import { AdvertAdd } from '@app/presentation/pages/advert-add/advert-add';
import { NotFound } from '@app/presentation/pages/not-found/not-found';
import { UserProfile } from '@app/presentation/pages/user-profile/user-profile';
import { Search } from '@app/presentation/pages/search/search';
import { Settings } from '@app/presentation/pages/settings/settings';

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
