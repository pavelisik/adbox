import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-advert-skeleton',
    imports: [SkeletonModule],
    templateUrl: './advert-skeleton.html',
    styleUrl: './advert-skeleton.scss',
})
export class AdvertSkeleton {}
