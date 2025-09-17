import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriesApiService } from '@app/infrastructure/categories/services';
import { Category } from '@app/pages/advert/domains';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private readonly apiService = inject(CategoriesApiService);

    getCategory(id: string): Observable<Category> {
        return this.apiService.getCategory(id);
    }

    getAllCategories(): Observable<Category[]> {
        return this.apiService.getAllCategories();
    }
}
