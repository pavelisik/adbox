import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { UsersFacade } from '@app/core/auth/services';
import {
    AdvertService,
    AdvertStoreService,
    BreadcrumbsService,
    BreadcrumbsStateService,
} from '@app/shared/services';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AdvertFacade {
    private readonly advertStore = inject(AdvertStoreService);
    private readonly advertService = inject(AdvertService);
    private readonly breadcrumbsState = inject(BreadcrumbsStateService);
    private readonly breadcrumbsService = inject(BreadcrumbsService);
    private readonly usersFacade = inject(UsersFacade);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    readonly advert = this.advertStore.advert;

    isAdvertLoading = signal<boolean>(false);
    isDeleteLoading = signal<boolean>(false);

    readonly isMyAdvert = computed(() => {
        const advert = this.advert();
        const currentUser = this.usersFacade.currentUser();
        return advert?.user?.id === currentUser?.id;
    });

    loadAdvert(id: string) {
        this.isAdvertLoading.set(true);
        this.clearState();

        this.advertService
            .getAdvert(id)
            .pipe(
                tap((advert) => {
                    this.advertStore.set(advert);
                    this.breadcrumbsService.buildBreadcrumbsForAdvert();
                }),
                catchError((error) => {
                    console.error(error);
                    this.clearState();
                    return of(null);
                }),
                finalize(() => this.isAdvertLoading.set(false)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    deleteCurrentAdvert() {
        const advertId = this.advert()?.id;
        if (!advertId) return;

        this.isDeleteLoading.set(true);

        this.advertService
            .deleteAdvert(advertId)
            .pipe(
                tap((res) => {
                    this.usersFacade.refreshAuthUser();
                    this.clearState();
                    this.router.navigate(['user/adverts']);
                }),
                catchError((error) => {
                    console.error(error);
                    return of(null);
                }),
                finalize(() => this.isDeleteLoading.set(false)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    private clearState() {
        this.advertStore.clear();
        this.breadcrumbsState.clear();
    }
}
