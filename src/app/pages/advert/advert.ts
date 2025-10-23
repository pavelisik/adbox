import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Breadcrumbs, SvgIcon, ImageGallery, Comments } from '@app/shared/components';
import { AdvertFacade, BreadcrumbsStateService } from '@app/shared/services';
import { PriceFormatPipe, DateFormatPipe } from '@app/shared/pipes';
import { ButtonModule } from 'primeng/button';
import { AuthFacade, UserFacade } from '@app/core/auth/services';
import { DialogService } from '@app/core/dialog';
import { ConfirmService } from '@app/core/confirmation';
import { AdvertSkeleton } from '@app/shared/components/skeletons';
import { NotificationService } from '@app/core/notification';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Title } from '@angular/platform-browser';

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
        DateFormatPipe,
        Comments,
    ],
    templateUrl: './advert.html',
    styleUrl: './advert.scss',
})
export class Advert {
    private readonly advertFacade = inject(AdvertFacade);
    private readonly breadcrumbsState = inject(BreadcrumbsStateService);
    private readonly confirm = inject(ConfirmService);
    private readonly dialogService = inject(DialogService);
    private readonly authFacade = inject(AuthFacade);
    private readonly userFacade = inject(UserFacade);
    private readonly route = inject(ActivatedRoute);
    private readonly notify = inject(NotificationService);
    private breakpointObserver = inject(BreakpointObserver);
    private readonly titleService = inject(Title);

    readonly isUpdatingFavorite = signal<boolean>(false);

    readonly advert = this.advertFacade.advert;
    readonly breadcrumbs = this.breadcrumbsState.breadcrumbs;
    readonly currentUser = this.userFacade.currentUser;
    readonly isAuth = this.authFacade.isAuth;
    readonly isMyAdvert = this.advertFacade.isMyAdvert;
    readonly isAdvertLoading = this.advertFacade.isAdvertLoading;
    readonly isDeleteLoading = this.advertFacade.isDeleteLoading;

    readonly isFavorite = computed(() => {
        const advertId = this.advert()?.id;
        if (!advertId) return false;
        return this.userFacade.isAdvertInFavorites(advertId);
    });

    // для адаптивного изменения порядка элементов на странице
    isMobile = toSignal(
        this.breakpointObserver
            .observe(['(max-width: 991px)'])
            .pipe(map((result) => result.matches)),
        { initialValue: window.innerWidth <= 991 },
    );

    constructor() {
        const advertId = this.route.snapshot.paramMap.get('id');
        if (advertId) {
            this.advertFacade.loadAdvert(advertId);
            // сразу после загрузки объявления убираем баг с прокруткой сайдбара
            window.scrollTo({ top: 0, behavior: 'auto' });
        }

        effect(() => {
            const advertName = this.advert()?.name;

            if (advertName) {
                const title = 'ADBOX - ' + advertName;
                this.titleService.setTitle(title);
            }
        });
    }

    infoDialogOpen(userName: string, phoneNumber: string) {
        this.dialogService.open('info', userName, phoneNumber);
    }

    mapDialogOpen() {
        this.dialogService.open('address-on-map');
    }

    deleteAdvert() {
        this.confirm.confirm('deleteAdvert', () => {
            this.advertFacade.deleteCurrentAdvert();
        });
    }

    // добавление или удаление из избранного с задержкой
    toggleFavorite() {
        if (this.isUpdatingFavorite()) return;
        this.isUpdatingFavorite.set(true);

        const advertId = this.advert()?.id;
        if (!advertId) return;

        if (this.isFavorite()) {
            this.userFacade.removeAdvertFromFavorite(advertId);
            this.notify.info('Обновление данных', 'Объявление удалено из избранного');
        } else {
            this.userFacade.addAdvertToFavorite(advertId);
            this.notify.info('Обновление данных', 'Объявление добавлено в избранное');
        }

        setTimeout(() => this.isUpdatingFavorite.set(false), 1000);
    }
}
