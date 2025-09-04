import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, shareReplay } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ImagesService {
    http = inject(HttpClient);
    baseApiUrl = 'http://dzitskiy.ru:5000/Images/';

    private imageCache = new Map<string, Observable<string>>();

    getImage(id: string): Observable<string> {
        if (!id) return of('');
        if (this.imageCache.has(id)) {
            return this.imageCache.get(id)!;
        }

        const req$ = this.http.get(`${this.baseApiUrl}${id}`, { responseType: 'blob' }).pipe(
            map((blob) => URL.createObjectURL(blob)), // превращаем в blob-url
            shareReplay(1) // кэшируем для повторных подписчиков
        );

        this.imageCache.set(id, req$);
        return req$;
    }
}
