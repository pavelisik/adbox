import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Breadcrumbs, SvgIcon, ImageGallery } from '@app/shared/components';
import { AdvertFacade, BreadcrumbsStateService } from '@app/shared/services';
import { PriceFormatPipe } from '@app/shared/pipes';
import { ButtonModule } from 'primeng/button';
import { AuthStateService } from '@app/core/auth/services';
import { DialogService } from '@app/core/dialog';
import { ConfirmService } from '@app/core/confirmation';
import { AdvertSkeleton } from './advert-skeleton/advert-skeleton';

@Component({
    selector: 'app-advert',
    imports: [
        BreadcrumbModule,
        Breadcrumbs,
        PriceFormatPipe,
        ButtonModule,
        SvgIcon,
        ImageGallery,
        RouterLink,
        AdvertSkeleton,
    ],
    templateUrl: './advert.html',
    styleUrl: './advert.scss',
})
export class Advert {
    private readonly advertFacade = inject(AdvertFacade);
    private readonly breadcrumbsState = inject(BreadcrumbsStateService);
    private readonly confirm = inject(ConfirmService);
    private readonly dialogService = inject(DialogService);
    private readonly authStateService = inject(AuthStateService);
    private readonly route = inject(ActivatedRoute);

    readonly advert = this.advertFacade.advert;
    readonly breadcrumbs = this.breadcrumbsState.breadcrumbs;

    readonly isMyAdvert = this.advertFacade.isMyAdvert;
    readonly isAdvertLoading = this.advertFacade.isAdvertLoading;
    readonly isDeleteLoading = this.advertFacade.isDeleteLoading;

    constructor() {
        const advertId = this.route.snapshot.paramMap.get('id');
        if (advertId) {
            this.advertFacade.loadAdvert(advertId);
        }
    }

    infoDialogOpen(userName: string, phoneNumber: string) {
        this.dialogService.open('info', userName, phoneNumber);
    }

    isAuth(): boolean {
        return this.authStateService.isAuth();
    }

    deleteAdvert() {
        this.confirm.confirm('deleteAdvert', () => {
            this.advertFacade.deleteCurrentAdvert();
        });
    }
}
