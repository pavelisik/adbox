import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-category-filter-skeleton',
    imports: [SkeletonModule],
    templateUrl: './category-filter-skeleton.html',
    styleUrl: './category-filter-skeleton.scss',
})
export class CategoryFilterSkeleton {}
