import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Advert, AdvertSearchRequest } from '@app/data/interfaces/advert';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AdvertService {
    http = inject(HttpClient);
    baseApiUrl = 'http://dzitskiy.ru:5000/Advert/';

    getAdvert(id: string) {
        return this.http.get<Advert>(`${this.baseApiUrl}${id}`);
    }

    searchAdverts(params: AdvertSearchRequest, limit = 5) {
        return this.http
            .post<Advert[]>(`${this.baseApiUrl}search`, params)
            .pipe(map((res) => res.slice(0, limit)));
    }
}
