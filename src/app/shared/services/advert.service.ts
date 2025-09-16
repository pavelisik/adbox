import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdvertApiService } from '@app/infrastructure/advert/services';
import { AdvertSearchRequest, ShortAdvert } from '@app/pages/adverts-list/domains';
import { FullAdvert } from '@app/pages/advert/domains';

@Injectable({
    providedIn: 'root',
})
export class AdvertService {
    private readonly apiService = inject(AdvertApiService);

    getAdvert(id: string): Observable<FullAdvert> {
        return this.apiService.getAdvert(id);
    }

    searchAdverts(request: AdvertSearchRequest, limit = 8): Observable<ShortAdvert[]> {
        return this.apiService.searchAdverts(request).pipe(map((res) => res.slice(0, limit)));
    }
}
