import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdvertSearchRequestDTO, FullAdvertDTO, ShortAdvertDTO } from '../dto';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class AdvertApiService {
    private readonly http = inject(HttpClient);

    getAdvert(id: string): Observable<FullAdvertDTO> {
        return this.http.get<FullAdvertDTO>(`${environment.baseApiURL}/Advert/${id}`);
    }

    searchAdverts(params: AdvertSearchRequestDTO): Observable<ShortAdvertDTO[]> {
        return this.http.post<ShortAdvertDTO[]>(`${environment.baseApiURL}/Advert/search`, params);
    }
}
