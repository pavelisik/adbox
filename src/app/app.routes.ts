import { Routes } from '@angular/router';
import { canActivateAuth } from '@app/auth/auth.guard';
import { MainLayout } from '@app/layouts/main-layout/main-layout';
import { AdvertPage } from '@app/pages/advert-page/advert-page';
import { HomePage } from '@app/pages/home-page/home-page';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            { path: '', component: HomePage },
            { path: 'advert/:id', component: AdvertPage },
            {
                path: 'admin',
                component: HomePage,
                canActivate: [canActivateAuth],
            },
        ],
    },
];
