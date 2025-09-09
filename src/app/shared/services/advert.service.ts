import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdvertsApiService } from '@app/infrastructure/adverts/services/adverts.api.service';
import {
    AdvertSearchRequestToDTOAdapter,
    FullAdvertFromDTOAdapter,
    ShortAdvertFromDTOAdapter,
} from '@app/pages/adverts-list/adapters';
import { AdvertSearchRequest, FullAdvert, ShortAdvert } from '@app/pages/adverts-list/domains';

@Injectable({
    providedIn: 'root',
})
export class AdvertService {
    private readonly apiService = inject(AdvertsApiService);

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
