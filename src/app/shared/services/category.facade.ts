import { computed, DestroyRef, effect, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryService, CategoryStoreService } from '@app/shared/services';
import { transformCategories } from '@app/shared/utils';
import { catchError, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CategoryFacade {
    private readonly categoryService = inject(CategoryService);
    private readonly categoryStore = inject(CategoryStoreService);
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        effect(() => {
            this.categoryService
                .getAllCategories()
                .pipe(
                    tap((categories) => this.categoryStore.setAllCategories(categories)),
                    catchError(() => {
                        this.categoryStore.clearAllCategories();
                        return of(null);
                    }),
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe();
        });
    }

    // трансформируем категории в древовидную структуру
    readonly allCategories = computed(() =>
        transformCategories(this.categoryStore.allCategories()),
    );
}
