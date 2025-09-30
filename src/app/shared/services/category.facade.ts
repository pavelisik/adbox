import { computed, effect, inject, Injectable } from '@angular/core';
import { CategoryService, CategoryStoreService } from '@app/shared/services';
import { transformCategories } from '@app/shared/utils';

@Injectable({
    providedIn: 'root',
})
export class CategoryFacade {
    private readonly categoryService = inject(CategoryService);
    private readonly categoryStore = inject(CategoryStoreService);

    constructor() {
        effect(() => {
            this.categoryService.getAllCategories().subscribe({
                next: (categories) => this.categoryStore.setAllCategories(categories),
                error: () => this.categoryStore.clearAllCategories(),
            });
        });
    }

    // трансформируем категории в древовидную структуру
    readonly allCategories = computed(() =>
        transformCategories(this.categoryStore.allCategories()),
    );
}
