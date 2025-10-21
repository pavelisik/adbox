import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '@app/core/auth/domains';
import { UserFacade, UserService } from '@app/core/auth/services';
import { AdvertSearchRequest } from '@app/pages/adverts-list/domains';
import { AdvertService, AdvertsListService, AdvertsListStateService } from '@app/shared/services';
import { sortAdvertsByDate } from '@app/shared/utils';
import { catchError, finalize, map, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AdvertsListFacade {
    private readonly advertsListState = inject(AdvertsListStateService);
    private readonly advertsListService = inject(AdvertsListService);
    private readonly advertService = inject(AdvertService);
    private readonly userService = inject(UserService);
    private readonly userFacade = inject(UserFacade);
    private readonly destroyRef = inject(DestroyRef);

    readonly adverts = this.advertsListState.advertsList;

    readonly advertsAuthor = signal<User | null>(null);
    readonly isLoading = signal<boolean>(false);
    readonly isDeleteLoading = signal<boolean>(false);

    searchAdverts(search?: string, category?: string): void {
        this.isLoading.set(true);
        this.clearState();

        this.advertsListService
            .searchAdverts(this.buildSearchRequest(search, category))
            .pipe(
                tap((adverts) => {
                    this.advertsListState.set(adverts);
                }),
                catchError((error) => {
                    console.error(error);
                    this.advertsListState.clear();
                    return of(null);
                }),
                finalize(() => this.isLoading.set(false)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    loadUserAdverts(userId: string) {
        if (!userId) return;

        this.isLoading.set(true);
        this.clearState();

        this.userService
            .getUser(userId)
            .pipe(
                tap((user) => {
                    this.advertsAuthor.set(user);
                }),
                map((user) => user.adverts ?? []),
                tap((adverts) => {
                    this.advertsListState.set(adverts);
                }),
                catchError((error) => {
                    console.error(error);
                    this.advertsListState.clear();
                    return of(null);
                }),
                finalize(() => this.isLoading.set(false)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    deleteAdvert(advertId: string) {
        if (!advertId) return;

        this.isDeleteLoading.set(true);

        this.advertService
            .deleteAdvert(advertId)
            .pipe(
                tap((res) => {
                    this.removeAdvertFromState(advertId);
                    this.userFacade.refreshAuthUser();
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

    private removeAdvertFromState(advertId: string) {
        if (!advertId) return;

        const updatedAdverts = this.adverts().filter((advert) => advert.id !== advertId);
        this.advertsListState.set(updatedAdverts);
    }

    private buildSearchRequest(search?: string, category?: string): AdvertSearchRequest {
        return {
            search: search || undefined,
            showNonActive: true,
            category: category || undefined,
        };
    }

    private clearState() {
        this.advertsListState.clear();
        this.advertsAuthor.set(null);
    }
}
