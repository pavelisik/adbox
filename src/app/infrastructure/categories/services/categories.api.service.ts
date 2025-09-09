import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryDTO } from '../dto';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class CategoriesApiService {
    private readonly http = inject(HttpClient);

    getCategory(id: string): Observable<CategoryDTO> {
        return this.http.get<CategoryDTO>(`${environment.baseApiURL}/Categories/${id}`);
    }
}
