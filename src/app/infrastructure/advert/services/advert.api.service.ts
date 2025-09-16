import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
    AdvertSearchRequestDTO,
    FullAdvertDTO,
    ShortAdvertDTO,
} from '@app/infrastructure/advert/dto';
import {
    AdvertSearchRequestToDTOAdapter,
    FullAdvertFromDTOAdapter,
    ShortAdvertFromDTOAdapter,
} from '@app/infrastructure/advert/adapters';
import { FullAdvert } from '@app/pages/advert/domains';
import { AdvertSearchRequest, ShortAdvert } from '@app/pages/adverts-list/domains';

@Injectable({
    providedIn: 'root',
})
export class AdvertApiService {
    private readonly http = inject(HttpClient);

    getAdvert(id: string): Observable<FullAdvert> {
        return this.http
            .get<FullAdvertDTO>(`${environment.baseApiURL}/Advert/${id}`)
            .pipe(map((res) => FullAdvertFromDTOAdapter(res)));
    }

    searchAdverts(params: AdvertSearchRequest): Observable<ShortAdvert[]> {
        const request: AdvertSearchRequestDTO = AdvertSearchRequestToDTOAdapter(params);
        return this.http
            .post<ShortAdvertDTO[]>(`${environment.baseApiURL}/Advert/search`, request)
            .pipe(map((res) => res.map((item) => ShortAdvertFromDTOAdapter(item))));
    }
}
