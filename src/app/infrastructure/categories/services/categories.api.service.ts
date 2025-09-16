import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryDTO } from '../dto';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { CategoryFromDTOAdapter } from '@app/infrastructure/categories/adapters';
import { Category } from '@app/pages/advert/domains';

@Injectable({
    providedIn: 'root',
})
export class CategoriesApiService {
    private readonly http = inject(HttpClient);

    getCategory(id: string): Observable<Category> {
        return this.http
            .get<CategoryDTO>(`${environment.baseApiURL}/Categories/${id}`)
            .pipe(map((res) => CategoryFromDTOAdapter(res)));
    }
}
