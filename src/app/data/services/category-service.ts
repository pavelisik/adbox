import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Category } from '@app/data/interfaces/category';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    http = inject(HttpClient);
    baseApiUrl = 'http://dzitskiy.ru:5000/Categories';

    getCategory(id: string) {
        return this.http.get<Category>(`${this.baseApiUrl}/${id}`);
    }
}
