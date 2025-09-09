import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class ImagesApiService {
    private readonly http = inject(HttpClient);

    getImage(id: string): Observable<string> {
        return this.http
            .get(`${environment.baseApiURL}/Images/${id}`, { responseType: 'blob' })
            .pipe(map((blob) => URL.createObjectURL(blob)));
    }
}
