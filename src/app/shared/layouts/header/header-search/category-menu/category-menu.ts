import { Component, inject, output, signal } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { SvgIcon } from '@app/shared/components';
import { RouterLink } from '@angular/router';
import { Category } from '@app/pages/advert/domains';
import { CategoryService } from '@app/shared/services';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CategoriesTransformPipe } from '@app/shared/pipes';

@Component({
    selector: 'app-category-menu',
    imports: [
        ListboxModule,
        TieredMenuModule,
        SvgIcon,
        RouterLink,
        AsyncPipe,
        CategoriesTransformPipe,
    ],
    templateUrl: './category-menu.html',
    styleUrl: './category-menu.scss',
})
export class CategoryMenu {
    private readonly categoryService = inject(CategoryService);
    activeParent = signal<Category | null>(null);
    categorySelected = output<void>();

    categories$ = this.categoryService.getAllCategories().pipe(
        map((cats) => {
            // при загрузке делаем активной первую категорию для показа
            if (cats.length && !this.activeParent()) {
                this.activeParent.set(cats[0]);
            }
            return cats;
        }),
    );

    // активная родительская категория при наведении
    onHoverParent(item: Category) {
        this.activeParent.set(item);
    }

    // событие выбора категории при клике (для закрытия панели меню)
    onClickCategory() {
        this.categorySelected.emit();
    }
}
