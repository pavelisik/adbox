import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
    AdvertSearchRequestDTO,
    FullAdvertDTO,
    NewAdvertRequestDTO,
    ShortAdvertDTO,
} from '@app/infrastructure/advert/dto';
import {
    AdvertSearchRequestToDTOAdapter,
    FullAdvertFromDTOAdapter,
    ShortAdvertFromDTOAdapter,
} from '@app/infrastructure/advert/adapters';
import { FullAdvert } from '@app/pages/advert/domains';
import {
    AdvertSearchRequest,
    NewAdvertRequest,
    ShortAdvert,
} from '@app/pages/adverts-list/domains';
import { NewAdvertRequestToDTOAdapter } from '@app/infrastructure/advert/adapters/new-advert-request.adapter';

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

    newAdvert(params: NewAdvertRequest): Observable<ShortAdvert> {
        const request: NewAdvertRequestDTO = NewAdvertRequestToDTOAdapter(params);
        const formData = new FormData();
        formData.append('Name', request.title);
        if (request.description) formData.append('Description', request.description);
        if (request.images) {
            if (request.images.length > 1) {
                request.images.forEach((image) => {
                    formData.append('Images', image);
                });
            } else {
                formData.append('Images', request.images[0]);
            }
        }
        if (request.email) formData.append('Email', request.email);
        formData.append('Cost', request.cost.toString());
        formData.append('Phone', request.phone);
        formData.append('Location', request.location);
        formData.append('CategoryId', request.category);
        return this.http
            .post<ShortAdvertDTO>(`${environment.baseApiURL}/Advert`, formData)
            .pipe(map((res) => ShortAdvertFromDTOAdapter(res)));
    }
}
