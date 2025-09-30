import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

const cacheMap = new Map<string, HttpResponse<unknown>>();

export const imagesCacheInterceptor: HttpInterceptorFn = (req, next) => {
    // кэшируем только GET-запросы к изображениям
    if (req.method !== 'GET' || !req.url.includes('/Images/')) {
        return next(req);
    }

    const cachedResponse = cacheMap.get(req.urlWithParams);
    if (cachedResponse) {
        return of(cachedResponse.clone());
    }

    return next(req).pipe(
        tap((event: HttpEvent<unknown>) => {
            if (event instanceof HttpResponse && event.ok) {
                cacheMap.set(req.urlWithParams, event.clone());
            }
        }),
    );
};
