import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-ad-grid-item-skeleton',
    imports: [SkeletonModule],
    templateUrl: './ad-grid-item-skeleton.html',
    styleUrl: './ad-grid-item-skeleton.scss',
})
export class AdGridItemSkeleton {}
