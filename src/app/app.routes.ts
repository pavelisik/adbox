import { Routes } from '@angular/router';
import { canActivateAuth } from '@app/auth/auth.guard';
import { MainLayout } from '@app/layouts/main-layout/main-layout';
import { AddAdvertPage } from '@app/pages/add-advert-page/add-advert-page';
import { AdvertPage } from '@app/pages/advert-page/advert-page';
import { HomePage } from '@app/pages/home-page/home-page';
import { NotFoundPage } from '@app/pages/not-found-page/not-found-page';
import { ProfilePage } from '@app/pages/profile-page/profile-page';
import { SearchPage } from '@app/pages/search-page/search-page';
import { SettingsPage } from '@app/pages/settings-page/settings-page';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            { path: '', component: HomePage },
            { path: 'advert/:id', component: AdvertPage },
            { path: 'search', component: SearchPage },
            {
                path: 'user',
                canActivate: [canActivateAuth],
                children: [
                    { path: 'profile', component: ProfilePage },
                    { path: 'settings', component: SettingsPage },
                    { path: 'add-advert', component: AddAdvertPage },
                ],
            },
            { path: '**', component: NotFoundPage },
        ],
    },
];
