import { Component, inject, OnInit } from '@angular/core';
import { Category } from '@app/pages/advert/domains';
import { CategoryService } from '@app/shared/services';
import { transformCategories } from '@app/shared/utils';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { map } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-sidebar',
    imports: [PanelMenuModule, ButtonModule],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
    private readonly categoryService = inject(CategoryService);

    menuItems: MenuItem[] = [];

    ngOnInit() {
        this.categoryService
            .getAllCategories()
            .pipe(map((cats) => transformCategories(cats)))
            .subscribe((transformed) => {
                this.menuItems = this.buildMenuItems(transformed);
            });
    }

    private buildMenuItems(categories: Category[]): MenuItem[] {
        return categories.map((cat) => ({
            label: cat.name,
            items: cat.childs?.length ? this.buildMenuItems(cat.childs) : undefined,
        }));
    }
}
