import { Routes } from '@angular/router';
import { MainLayout } from '@app/layouts/main-layout/main-layout';
import { HomePage } from '@app/pages/home-page/home-page';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [{ path: '', component: HomePage }],
    },
];
