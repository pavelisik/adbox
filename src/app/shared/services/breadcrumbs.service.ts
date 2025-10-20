import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CITIES } from '@app/shared/data/cities';
import { AdvertStateService, BreadcrumbsStateService, CategoryService } from '@app/shared/services';
import { MenuItem } from 'primeng/api';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbsService {
    private readonly breadcrumbsState = inject(BreadcrumbsStateService);
    private readonly advertState = inject(AdvertStateService);
    private readonly categoryService = inject(CategoryService);
    private readonly destroyRef = inject(DestroyRef);

    readonly advert = this.advertState.advert;

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
                        const parentCategoryName = category?.name;
                        const parentCategoryId = category?.id;
                        this.setBreadcrumbs(parentCategoryName, parentCategoryId);
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

    private setBreadcrumbs(parentCategoryName?: string, parentCategoryId?: string) {
        const advert = this.advert();
        if (!advert) return;

        const items: MenuItem[] = [];

        // название города
        const city = this.extractCity(advert.location);
        if (city) items.push({ label: city });

        // родительская категория
        if (parentCategoryName && parentCategoryId)
            items.push({ label: parentCategoryName, id: parentCategoryId });

        // основная категория
        if (advert.category?.name)
            items.push({ label: advert.category.name, id: advert.category.id });

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
