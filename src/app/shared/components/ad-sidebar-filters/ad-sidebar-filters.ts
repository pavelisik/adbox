import { Component, inject } from '@angular/core';
import { Category } from '@app/pages/advert/domains';
import { CategoryService } from '@app/shared/services';
import { transformCategories } from '@app/shared/utils';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { map } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-ad-sidebar-filters',
    imports: [PanelMenuModule, ButtonModule, InputNumberModule, AsyncPipe],
    templateUrl: './ad-sidebar-filters.html',
    styleUrl: './ad-sidebar-filters.scss',
})
export class AdSidebarFilters {
    private readonly categoryService = inject(CategoryService);

    categoriesMenuItems$ = this.categoryService.getAllCategories().pipe(
        map((cats) => transformCategories(cats)),
        map((cats) => this.buildMenuItems(cats)),
    );

    // трансформируем массив со всеми категориями для вывода меню фильтра
    private buildMenuItems(categories: Category[]): MenuItem[] {
        return categories.map((cat) => {
            const item: MenuItem = { label: cat.name };
            if (cat.childs?.length) {
                item.items = this.buildMenuItems(cat.childs);
            }
            return item;
        });
    }
}
