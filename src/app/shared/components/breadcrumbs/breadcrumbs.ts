import { Component, inject, input } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import type { MenuItem } from 'primeng/api';
import { BreadcrumbsService } from '@app/shared/services';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-breadcrumbs',
    imports: [BreadcrumbModule, SkeletonModule],
    templateUrl: './breadcrumbs.html',
    styleUrl: './breadcrumbs.scss',
})
export class Breadcrumbs {
    private readonly breadcrumbsService = inject(BreadcrumbsService);
    readonly isLoading = this.breadcrumbsService.isLoading;

    items = input<MenuItem[]>([]);
}
