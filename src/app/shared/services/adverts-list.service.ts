import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdvertApiService } from '@app/infrastructure/advert/services';
import { AdvertSearchRequest, ShortAdvert } from '@app/pages/adverts-list/domains';

@Injectable({
    providedIn: 'root',
})
export class AdvertsListService {
    private readonly apiService = inject(AdvertApiService);

    searchAdverts(request: AdvertSearchRequest): Observable<ShortAdvert[]> {
        return this.apiService.searchAdverts(request);
    }
}
