import { Component, effect, inject, input } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import type { MenuItem } from 'primeng/api';
import { BreadcrumbsService } from '@app/shared/services';
import { SkeletonModule } from 'primeng/skeleton';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-breadcrumbs',
    imports: [BreadcrumbModule, SkeletonModule, RouterLink],
    templateUrl: './breadcrumbs.html',
    styleUrl: './breadcrumbs.scss',
})
export class Breadcrumbs {
    private readonly breadcrumbsService = inject(BreadcrumbsService);
    readonly isLoading = this.breadcrumbsService.isLoading;

    items = input<MenuItem[]>([]);

    constructor() {
        effect(() => {
            console.log(this.items());
        });
    }
}
