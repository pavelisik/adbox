import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CategoriesApiService } from '@app/infrastructure/categories/services';
import { Category } from '@app/pages/advert/domains';
import { CategoryFromDTOAdapter } from '@app/pages/advert/adapters';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private readonly apiService = inject(CategoriesApiService);

    getCategory(id: string): Observable<Category> {
        return this.apiService.getCategory(id).pipe(map((res) => CategoryFromDTOAdapter(res)));
    }
}
