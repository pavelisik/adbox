import { Observable, of } from 'rxjs';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { ImageService } from '@app/shared/services';

@Pipe({
    name: 'imageFromId',
})
export class ImageFromIdPipe implements PipeTransform {
    private imageService = inject(ImageService);

    transform(value: string | null | undefined): Observable<string> {
        if (value) {
            return this.imageService.getImage(value);
        }
        return of('empty');
    }
}
