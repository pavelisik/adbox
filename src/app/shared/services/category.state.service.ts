import { Injectable, signal } from '@angular/core';
import { Category } from '@app/pages/advert/domains';

@Injectable({
    providedIn: 'root',
})
export class CategoryStateService {
    private readonly _allCategories = signal<Category[]>([]);
    readonly allCategories = this._allCategories.asReadonly();

    set(categories: Category[]) {
        this._allCategories.set(categories);
    }

    clear() {
        this._allCategories.set([]);
    }
}
