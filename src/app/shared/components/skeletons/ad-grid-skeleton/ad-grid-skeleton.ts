import { Component, input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { AdGridItemSkeleton } from './ad-grid-item-skeleton/ad-grid-item-skeleton';

@Component({
    selector: 'app-ad-grid-skeleton',
    imports: [SkeletonModule, AdGridItemSkeleton],
    templateUrl: './ad-grid-skeleton.html',
    styleUrl: './ad-grid-skeleton.scss',
})
export class AdGridSkeleton {
    advertsCount = input.required<number>();

    range(advertsCount: number): number[] {
        return Array.from({ length: advertsCount }, (_, i) => i);
    }
}
