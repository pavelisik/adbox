import { Injectable, signal } from '@angular/core';
import { Category } from '@app/pages/advert/domains';

@Injectable({
    providedIn: 'root',
})
export class CategoryStoreService {
    private readonly _allCategories = signal<Category[]>([]);
    readonly allCategories = this._allCategories.asReadonly();

    setAllCategories(categories: Category[]) {
        this._allCategories.set(categories);
    }

    clearAllCategories() {
        this._allCategories.set([]);
    }
}
