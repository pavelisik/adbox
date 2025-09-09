import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class ImagesApiService {
    private readonly http = inject(HttpClient);

    getImage(id: string): Observable<Blob> {
        return this.http.get<Blob>(`${environment.baseApiURL}/Images/${id}`);
    }
}
