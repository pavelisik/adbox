import { Component, computed, input } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { ImagesFromIdsPipe } from '@app/shared/pipes';
import { Spinner } from '../spinner/spinner';
import { ImageModule } from 'primeng/image';

@Component({
    selector: 'app-image-gallery',
    imports: [GalleriaModule, ImagesFromIdsPipe, Spinner, ImageModule],
    templateUrl: './image-gallery.html',
    styleUrl: './image-gallery.scss',
})
export class ImageGallery {
    imagesIds = input<string[] | null>(null);
}
