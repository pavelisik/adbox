import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { SvgIcon } from '@app/shared/components';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Category } from '@app/pages/advert/domains';
import { CategoryStore } from '@app/shared/services';
import { findCategoryFromId } from '@app/shared/utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
    selector: 'app-category-menu',
    imports: [ListboxModule, TieredMenuModule, SvgIcon, RouterLink],
    templateUrl: './category-menu.html',
    styleUrl: './category-menu.scss',
})
export class CategoryMenu {
    private readonly categoryStore = inject(CategoryStore);
    private readonly route = inject(ActivatedRoute);
    readonly categories = this.categoryStore.allCategories;

    activeParent = signal<Category | null>(null);
    activeChild = signal<Category | null>(null);
    categorySelected = output<void>();

    queryCategoryId = toSignal(this.route.queryParams.pipe(map((p) => p['catId'] ?? '')), {
        initialValue: '',
    });

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
    initActiveCategory(categories: Category[] = this.categories()) {
        if (this.queryCategoryId()) {
            // используем функцию для поиска категории по id
            const foundCategory = findCategoryFromId(categories, this.queryCategoryId());
            if (foundCategory) {
                this.activeParent.set(foundCategory.parent ?? categories[0] ?? null);
                this.activeChild.set(foundCategory.child ?? null);
                return;
            }
        }
        this.activeParent.set(categories[0] ?? null);
        this.activeChild.set(null);
    }

    // устанавливаем активную категорию
    constructor() {
        effect(() => {
            if (this.categories().length) {
                this.initActiveCategory(this.categories());
            }
        });
    }
}
