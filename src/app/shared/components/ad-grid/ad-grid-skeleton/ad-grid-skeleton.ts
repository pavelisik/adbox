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
    count = input<number>(1);

    range(count: number): number[] {
        return Array.from({ length: count }, (_, i) => i);
    }
}
