import { Component, computed, effect, inject, signal } from '@angular/core';
import { Category } from '@app/pages/advert/domains';
import { CategoryStore } from '@app/shared/services';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SvgIcon } from '@app/shared/components/svg-icon/svg-icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { findCategoryFromId } from '@app/shared/utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
    selector: 'app-ad-sidebar-filters',
    imports: [PanelMenuModule, ButtonModule, InputNumberModule, SvgIcon, RouterLink],
    templateUrl: './ad-sidebar-filters.html',
    styleUrl: './ad-sidebar-filters.scss',
})
export class AdSidebarFilters {
    private readonly categoryStore = inject(CategoryStore);
    private readonly route = inject(ActivatedRoute);
    readonly categories = this.categoryStore.allCategories;

    activeItem = signal<Category | null>(null);

    queryCategoryId = toSignal(this.route.queryParams.pipe(map((p) => p['catId'] ?? '')), {
        initialValue: '',
    });

    // преобразованные категории для вывода меню
    categoriesMenuItems = computed(() => this.buildMenuItems(this.categories()));

    // трансформируем массив со всеми категориями для вывода меню фильтра
    private buildMenuItems(categories: Category[], isRoot = true): MenuItem[] {
        return categories.map((cat) => {
            const item: MenuItem = {
                label: cat.name,
                data: cat,
                isRoot,
            };
            if (cat.childs?.length) {
                item.items = this.buildMenuItems(cat.childs, false);
            }
            return item;
        });
    }

    // принудительное раскрытие пункта меню родителя
    private expandParent(parentId: string) {
        const menuItem = this.categoriesMenuItems().find((item) => item['data'].id === parentId);
        if (menuItem) {
            menuItem['expanded'] = true;
        }
    }

    // принудительное закрытие всех пунктов меню
    private collapseAll(menuItems: MenuItem[]) {
        menuItems.forEach((item) => {
            item['expanded'] = false;
        });
    }

    // установка активной категории если есть в параметре
    initActiveCategory(categories: Category[]) {
        if (this.queryCategoryId()) {
            // используем функцию для поиска категории по id (без разделения на родительские и дочерние)
            const foundCategory = findCategoryFromId(categories, this.queryCategoryId(), false);
            if (foundCategory) {
                this.activeItem.set(foundCategory.item ?? null);
                this.collapseAll(this.categoriesMenuItems());
                if (foundCategory.child && foundCategory.parent) {
                    this.expandParent(foundCategory.parent.id);
                }
            }
        } else {
            // если нет в параметре - сбрасываем активный пункт меню и все сворачиваем
            this.activeItem.set(null);
            this.collapseAll(this.categoriesMenuItems());
        }
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
