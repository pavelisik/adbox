import { Component, input } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { ImagesFromIdsPipe } from '@app/shared/pipes';
import { ImageModule } from 'primeng/image';
import { ImageGallerySkeleton } from './image-gallery-skeleton/image-gallery-skeleton';

@Component({
    selector: 'app-image-gallery',
    imports: [GalleriaModule, ImagesFromIdsPipe, ImageModule, ImageGallerySkeleton],
    templateUrl: './image-gallery.html',
    styleUrl: './image-gallery.scss',
})
export class ImageGallery {
    imagesIds = input<string[] | null>(null);
}
