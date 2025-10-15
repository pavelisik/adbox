import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CITIES } from '@app/shared/components/breadcrumbs/data/cities';
import { BreadcrumbsStateService, CategoryService } from '@app/shared/services';
import { AdvertStoreService } from '@app/shared/services/advert.store.service';
import { MenuItem } from 'primeng/api';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbsService {
    private readonly breadcrumbsState = inject(BreadcrumbsStateService);
    private readonly advertStore = inject(AdvertStoreService);
    private readonly categoryService = inject(CategoryService);
    private readonly destroyRef = inject(DestroyRef);

    readonly advert = this.advertStore.advert;

    readonly isLoading = signal<boolean>(false);

    // создаем хлебные крошки для страницы объявления
    buildBreadcrumbsForAdvert() {
        const advert = this.advert();
        if (!advert) return;

        this.breadcrumbsState.clear();

        this.isLoading.set(true);

        const parentId = advert.category?.parentId;
        if (this.isValidParentId(parentId)) {
            this.categoryService
                .getCategory(parentId)
                .pipe(
                    tap((category) => {
                        const parentCategory = category?.name;
                        this.setBreadcrumbs(parentCategory);
                    }),
                    catchError((error) => {
                        console.error(error);
                        this.setBreadcrumbs();
                        return of(null);
                    }),
                    finalize(() => this.isLoading.set(false)),
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe();
        } else {
            this.setBreadcrumbs();
            this.isLoading.set(false);
        }
    }

    private setBreadcrumbs(parentCategory?: string) {
        const advert = this.advert();
        if (!advert) return;

        const items: MenuItem[] = [];

        // название города
        const city = this.extractCity(advert.location);
        if (city) items.push({ label: city });

        // родительская категория
        if (parentCategory) items.push({ label: parentCategory });

        // основная категория
        if (advert.category?.name) items.push({ label: advert.category.name });

        this.breadcrumbsState.set(items);
    }

    private isValidParentId(id?: string): boolean {
        return !!id && id !== '00000000-0000-0000-0000-000000000000';
    }

    // получаем название города из адреса
    // временное решение с использованием списка городов (можно вынести в адаптер и добавить city)
    private extractCity(address: string): string | null {
        if (!address) return null;
        return (
            CITIES.find((cityName) => address.toLowerCase().includes(cityName.toLowerCase())) ??
            null
        );
    }
}
