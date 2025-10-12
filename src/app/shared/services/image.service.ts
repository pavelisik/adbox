import { inject, Injectable } from '@angular/core';
import { ImagesApiService } from '@app/infrastructure/images';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ImageService {
    private readonly apiService = inject(ImagesApiService);

    getImage(id: string): Observable<string> {
        return this.apiService.getImage(id);
    }

    deleteImage(id: string): Observable<void> {
        return this.apiService.deleteImage(id);
    }
}
