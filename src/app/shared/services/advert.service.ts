import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdvertApiService } from '@app/infrastructure/advert/services';
import {
    AdvertSearchRequestToDTOAdapter,
    ShortAdvertFromDTOAdapter,
} from '@app/pages/adverts-list/adapters';
import { FullAdvertFromDTOAdapter } from '@app/pages/advert/adapters';
import { AdvertSearchRequest, ShortAdvert } from '@app/pages/adverts-list/domains';
import { FullAdvert } from '@app/pages/advert/domains';

@Injectable({
    providedIn: 'root',
})
export class AdvertService {
    private readonly apiService = inject(AdvertApiService);

    getAdvert(id: string): Observable<FullAdvert> {
        return this.apiService.getAdvert(id).pipe(map((res) => FullAdvertFromDTOAdapter(res)));
    }

    searchAdverts(params: AdvertSearchRequest, limit = 4): Observable<ShortAdvert[]> {
        const request = AdvertSearchRequestToDTOAdapter(params);
        return this.apiService.searchAdverts(request).pipe(
            map((res) => res.map((item) => ShortAdvertFromDTOAdapter(item))),
            map((res) => res.slice(0, limit))
        );
    }
}
