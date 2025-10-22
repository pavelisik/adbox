import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-image-skeleton',
    imports: [SkeletonModule],
    templateUrl: './image-skeleton.html',
    styleUrl: './image-skeleton.scss',
})
export class ImageSkeleton {}
