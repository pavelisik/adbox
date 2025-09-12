import { Component, input } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import type { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-breadcrumbs',
    imports: [BreadcrumbModule],
    templateUrl: './breadcrumbs.html',
    styleUrl: './breadcrumbs.scss',
})
export class Breadcrumbs {
    items = input<MenuItem[]>([]);
}
