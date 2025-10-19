import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '@app/core/auth/domains';
import { UserService } from '@app/core/auth/services';
import { AdvertSearchRequest } from '@app/pages/adverts-list/domains';
import { AdvertsListService, AdvertsListStateService } from '@app/shared/services';
import { catchError, finalize, map, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AdvertsListFacade {
    private readonly advertsListState = inject(AdvertsListStateService);
    private readonly advertsListService = inject(AdvertsListService);
    private readonly userService = inject(UserService);
    private readonly destroyRef = inject(DestroyRef);

    readonly adverts = this.advertsListState.advertsList;

    readonly advertsAuthor = signal<User | null>(null);
    readonly isLoading = signal<boolean>(false);

    searchAdverts(search?: string, category?: string, count?: number): void {
        this.isLoading.set(true);
        this.clearState();

        this.advertsListService
            .searchAdverts(this.buildSearchRequest(search, category))
            .pipe(
                map((adverts) => (count ? adverts.slice(0, count) : adverts)),
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
