import { Component, inject, output, signal } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { SvgIcon } from '@app/shared/components';
import { Router, RouterLink } from '@angular/router';
import { Category } from '@app/pages/advert/domains';
import { CategoryService } from '@app/shared/services';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { findCategoryFromId, transformCategories } from '@app/shared/utils';

@Component({
    selector: 'app-category-menu',
    imports: [ListboxModule, TieredMenuModule, SvgIcon, RouterLink, AsyncPipe],
    templateUrl: './category-menu.html',
    styleUrl: './category-menu.scss',
})
export class CategoryMenu {
    private readonly categoryService = inject(CategoryService);
    private readonly router = inject(Router);
    private categories: Category[] = [];
    activeParent = signal<Category | null>(null);
    activeChild = signal<Category | null>(null);
    categorySelected = output<void>();

    categories$ = this.categoryService.getAllCategories().pipe(
        map((cats) => {
            const transformedCats = transformCategories(cats);
            this.categories = transformedCats;
            this.initActiveCategory(transformedCats);
            return transformedCats;
        }),
    );

    // активная родительская категория при наведении
    onHoverParent(item: Category) {
        this.activeParent.set(item);
    }

    // активная дочерняя категория при наведении
    onHoverChild(item: Category) {
        this.activeChild.set(item);
    }

    // событие выбора категории при клике (для закрытия панели меню)
    onClickCategory() {
        this.categorySelected.emit();
    }

    // установка активной категории если есть в параметре (если нет - ставим первую)
    initActiveCategory(categories: Category[] = this.categories) {
        const queryCategoryId = this.router.routerState.snapshot.root.queryParams['category'];
        if (queryCategoryId) {
            // используем функцию для поиска категории по id
            const foundCategory = findCategoryFromId(categories, queryCategoryId);
            if (foundCategory) {
                this.activeParent.set(foundCategory.parent ?? categories[0] ?? null);
                this.activeChild.set(foundCategory.child ?? null);
                return;
            }
        }
        this.activeParent.set(categories[0] ?? null);
        this.activeChild.set(null);
    }
}
