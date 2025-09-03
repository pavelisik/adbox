import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Advert } from '@app/data/interfaces/advert';

@Injectable({
    providedIn: 'root',
})
export class AdvertService {
    http = inject(HttpClient);
    baseApiUrl = 'http://dzitskiy.ru:5000/Advert/';

    getAdvert(id: string) {
        return this.http.get<Advert>(`${this.baseApiUrl}${id}`);
    }
}
