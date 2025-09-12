import { Component, computed, input } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { ImagesFromIdsPipe } from '@app/shared/pipes/images-from-ids.pipe';

@Component({
    selector: 'app-image-gallery',
    imports: [GalleriaModule, ImagesFromIdsPipe],
    templateUrl: './image-gallery.html',
    styleUrl: './image-gallery.scss',
})
export class ImageGallery {
    imagesIds = input<string[] | null>(null);
}
