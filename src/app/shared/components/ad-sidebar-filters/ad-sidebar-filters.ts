import { Component, computed, effect, inject, signal } from '@angular/core';
import { Category } from '@app/pages/advert/domains';
import { CategoryFacade } from '@app/shared/services';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SvgIcon } from '@app/shared/components/svg-icon/svg-icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { findCategoryFromId } from '@app/shared/utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdvertsQueryParams, CategoryMenuItem } from '@app/pages/adverts-list/domains';

@Component({
    selector: 'app-ad-sidebar-filters',
    imports: [
        PanelMenuModule,
        ButtonModule,
        InputNumberModule,
        SvgIcon,
        RouterLink,
        ReactiveFormsModule,
    ],
    templateUrl: './ad-sidebar-filters.html',
    styleUrl: './ad-sidebar-filters.scss',
})
export class AdSidebarFilters {
    private readonly categoryFacade = inject(CategoryFacade);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    readonly categories = this.categoryFacade.allCategories;
    readonly activeItem = signal<Category | null>(null);

    readonly queryParams = toSignal(this.route.queryParams, {
        initialValue: {} as AdvertsQueryParams,
    });

    filterForm: FormGroup = this.fb.group({
        minPrice: [null],
        maxPrice: [null],
    });

    onSubmit() {
        const { minPrice, maxPrice } = this.filterForm.value;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { minPrice, maxPrice },
            queryParamsHandling: 'merge',
        });
    }

    // преобразованные категории для вывода меню
    categoriesMenuItems = computed<CategoryMenuItem[]>(() =>
        this.buildMenuItems(this.categories()),
    );

    // трансформируем массив со всеми категориями для вывода меню фильтра
    private buildMenuItems(categories: Category[], isRootItem = true): CategoryMenuItem[] {
        return categories.map((cat) => {
            const item: CategoryMenuItem = {
                label: cat.name,
                data: cat,
                isRootItem,
            };
            if (cat.childs) item.items = this.buildMenuItems(cat.childs, false);
            return item;
        });
    }

    // принудительное раскрытие пункта меню
    private expandItem(itemId: string) {
        const menuItem = this.categoriesMenuItems().find((item) => item.data.id === itemId);
        if (menuItem) menuItem.expanded = true;
    }

    // принудительное закрытие всех пунктов меню
    private collapseAll(menuItems: CategoryMenuItem[]) {
        menuItems.forEach((item) => (item.expanded = false));
    }

    // установка активной категории по id в параметре
    initActiveCategory(categories: Category[]) {
        // принудительно сворачиваем все категории
        this.collapseAll(this.categoriesMenuItems());
        // если нет id - сбрасываем активный пункт меню
        if (!this.queryParams().catId) {
            this.activeItem.set(null);
            return;
        }
        // поиск категории по id (без разделения на родительские и дочерние)
        const foundCategory = findCategoryFromId(categories, this.queryParams().catId, false);
        if (foundCategory) {
            this.activeItem.set(foundCategory.item ?? null);
            if (foundCategory.child && foundCategory.parent) {
                // если активная категория вложенная - разворачиваем родительскую
                this.expandItem(foundCategory.parent.id);
            } else {
                // если активная категория не вложенная - разворачиваем ее
                this.expandItem(this.queryParams().catId);
            }
        }
    }

    constructor() {
        effect(() => {
            // устанавливаем активную категорию
            if (this.categories()) this.initActiveCategory(this.categories());
        });
        effect(() => {
            // считываем значения минимальной и максимальной цены из параметров в форму
            this.filterForm.patchValue({
                minPrice: this.queryParams().minPrice ? Number(this.queryParams().minPrice) : null,
                maxPrice: this.queryParams().maxPrice ? Number(this.queryParams().maxPrice) : null,
            });
        });
    }
}
