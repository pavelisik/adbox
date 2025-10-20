import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { Spinner } from '@app/shared/components/spinner/spinner';

@Component({
    selector: 'app-image-gallery-skeleton',
    imports: [SkeletonModule, Spinner],
    templateUrl: './image-gallery-skeleton.html',
    styleUrl: './image-gallery-skeleton.scss',
})
export class ImageGallerySkeleton {}
