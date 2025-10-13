import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { Breadcrumbs } from '@app/shared/components';
import { AdvertService, CategoryService } from '@app/shared/services';
import { PriceFormatPipe } from '@app/shared/pipes';
import { ButtonModule } from 'primeng/button';
import { SvgIcon } from '@app/shared/components';
import { ImageGallery } from '@app/shared/components';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MenuItem } from 'primeng/api';
import { BreadcrumbsService } from '@app/shared/services';
import { FullAdvert } from '@app/pages/advert/domains';
import { AuthStateService, UsersFacade } from '@app/core/auth/services';
import { DialogService } from '@app/core/dialog';
import { ConfirmService } from '@app/core/confirmation';

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
    ],
    templateUrl: './advert.html',
    styleUrl: './advert.scss',
})
export class Advert implements OnInit {
    private readonly advertService = inject(AdvertService);
    private readonly categoryService = inject(CategoryService);
    private readonly breadcrumbsService = inject(BreadcrumbsService);
    private readonly usersFacade = inject(UsersFacade);
    private readonly confirm = inject(ConfirmService);
    private readonly dialogService = inject(DialogService);
    private readonly authStateService = inject(AuthStateService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    readonly currentUser = this.usersFacade.currentUser;

    advert = signal<FullAdvert | null>(null);
    parentId = signal<string | null>(null);
    breadcrumbs = signal<MenuItem[]>([]);
    isDeleteLoading = signal<boolean>(false);

    readonly advertId = computed<string | undefined>(() => {
        return this.advert()?.id;
    });

    readonly isMyAdvert = computed(() => {
        return this.usersFacade.isMyAdvert(this.advertId())();
    });

    advert$ = this.route.params.pipe(
        switchMap(({ id }) => {
            return this.advertService.getAdvert(id);
        }),
        tap((advert) => {
            this.advert.set(advert ?? null);
            this.parentId.set(advert.category?.parentId ?? null);
        }),
        takeUntilDestroyed(),
    );

    category$ = toObservable(this.parentId).pipe(
        switchMap((parentId) => {
            if (!parentId || parentId === '00000000-0000-0000-0000-000000000000') {
                return of(null);
            }
            return this.categoryService.getCategory(parentId);
        }),
        tap((cat) => {
            if (this.advert()) {
                this.breadcrumbs.set(
                    this.breadcrumbsService.buildForAdvert(this.advert()!, cat?.name),
                );
            }
        }),
        takeUntilDestroyed(),
    );

    infoDialogOpen(userName: string, phoneNumber: string) {
        this.dialogService.open('info', userName, phoneNumber);
    }

    isAuth(): boolean {
        return this.authStateService.isAuth();
    }

    deleteAdvert() {
        const advertId = this.advertId();
        if (!advertId) return;

        this.confirm.confirm('deleteAdvert', () => {
            this.isDeleteLoading.set(true);

            this.advertService
                .deleteAdvert(advertId)
                .pipe(
                    tap((res) => {
                        this.usersFacade.refreshAuthUser();
                        this.router.navigate(['user/adverts']);
                    }),
                    catchError((error) => {
                        console.error(error);
                        return of(null);
                    }),
                    finalize(() => {
                        this.isDeleteLoading.set(false);
                    }),
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe();
        });
    }

    ngOnInit() {
        this.advert$.subscribe();
        this.category$.subscribe();
    }
}
