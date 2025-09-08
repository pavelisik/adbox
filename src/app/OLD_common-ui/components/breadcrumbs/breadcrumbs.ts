import { Component, inject, Input } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import type { MenuItem } from 'primeng/api';
import type { AdvertFull } from '@app/data/interfaces/advert';
import { CITIES } from '@app/data/constants/cities';
import { CategoryService } from '@app/data/services/category-service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-breadcrumbs',
    imports: [BreadcrumbModule],
    templateUrl: './breadcrumbs.html',
    styleUrl: './breadcrumbs.scss',
})
export class Breadcrumbs {
    @Input() advert: AdvertFull | null = null;
    items: MenuItem[] = [];
    categoryService = inject(CategoryService);

    // получаем название города из адреса
    // временное решение с использованием списка городов
    extractCity(address: string): string | null {
        if (!address) return null;
        const city = CITIES.find((cityName) =>
            address.toLowerCase().includes(cityName.toLowerCase())
        );
        return city ?? null;
    }

    // создаем массив значений для вывода хлебных крошек
    async createItems() {
        if (!this.advert) return;
        const items: MenuItem[] = [];

        // название города
        const city = this.extractCity(this.advert.location);
        if (city) {
            items.push({ label: city });
        }

        // родительская категория
        const parentCatID = this.advert.category?.parentId;
        if (parentCatID) {
            try {
                const category = await firstValueFrom(
                    this.categoryService.getCategory(parentCatID)
                );
                if (category?.name) {
                    items.push({ label: category.name });
                }
            } catch (e) {
                console.warn('Ошибка получения родительской категории:', e);
            }
        }

        // основная категория
        const cat = this.advert.category?.name;
        if (cat) {
            items.push({ label: cat });
        }

        this.items = items;
    }

    ngOnInit() {
        this.createItems();
    }
}
