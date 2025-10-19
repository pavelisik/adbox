import { computed, DestroyRef, effect, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryService, CategoryStateService } from '@app/shared/services';
import { transformCategories } from '@app/shared/utils';
import { catchError, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CategoryFacade {
    private readonly categoryService = inject(CategoryService);
    private readonly categoryState = inject(CategoryStateService);
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        effect(() => {
            this.categoryService
                .getAllCategories()
                .pipe(
                    tap((categories) => this.categoryState.set(categories)),
                    catchError(() => {
                        this.categoryState.clear();
                        return of(null);
                    }),
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe();
        });
    }

    // трансформируем категории в древовидную структуру
    readonly allCategories = computed(() =>
        transformCategories(this.categoryState.allCategories()),
    );
}
