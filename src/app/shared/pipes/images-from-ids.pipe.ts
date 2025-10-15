import { forkJoin, map, Observable, of } from 'rxjs';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { ImageService } from '@app/shared/services';

@Pipe({
    name: 'imagesFromIds',
})
export class ImagesFromIdsPipe implements PipeTransform {
    private imageService = inject(ImageService);

    transform(value: string[] | null | undefined): Observable<string[]> {
        if (value) {
            const observables = value.map((id) => this.imageService.getImage(id));
            return forkJoin(observables);
        }
        return of([]);
    }
}
