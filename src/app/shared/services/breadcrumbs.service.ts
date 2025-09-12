import { Injectable } from '@angular/core';
import { FullAdvert } from '@app/pages/advert/domains';
import { CITIES } from '@app/shared/components/breadcrumbs/data/cities';
import { MenuItem } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbsService {
    // получаем название города из адреса
    // временное решение с использованием списка городов
    private extractCity(address: string): string | null {
        if (!address) return null;
        return (
            CITIES.find((cityName) => address.toLowerCase().includes(cityName.toLowerCase())) ??
            null
        );
    }

    // создаем хлебные крошки для страницы объявления
    buildForAdvert(advert: FullAdvert, parentCategory?: string | null): MenuItem[] {
        const items: MenuItem[] = [];
        // название города
        const city = this.extractCity(advert.location);
        if (city) {
            items.push({ label: city });
        }
        // родительская категория
        if (parentCategory) {
            items.push({ label: parentCategory });
        }
        // основная категория
        if (advert.category?.name) {
            items.push({ label: advert.category.name });
        }
        return items;
    }
}
