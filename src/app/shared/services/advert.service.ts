import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { AdvertApiService } from '@app/infrastructure/advert/services';
import {
    AdvertSearchRequest,
    NewAdvertRequest,
    ShortAdvert,
} from '@app/pages/adverts-list/domains';
import { FullAdvert } from '@app/pages/advert/domains';
import { NotificationService } from '@app/core/notification';

@Injectable({
    providedIn: 'root',
})
export class AdvertService {
    private readonly apiService = inject(AdvertApiService);
    private readonly notify = inject(NotificationService);

    getAdvert(id: string): Observable<FullAdvert> {
        return this.apiService.getAdvert(id);
    }

    searchAdverts(request: AdvertSearchRequest, limit = 8): Observable<ShortAdvert[]> {
        return this.apiService.searchAdverts(request).pipe(map((res) => res.slice(0, limit)));
    }

    newAdvert(params: NewAdvertRequest): Observable<ShortAdvert> {
        return this.apiService.newAdvert(params).pipe(
            tap(() => {
                this.notify.success('Создание объявления', 'Объявление успешно создано');
            }),
        );
    }
}
