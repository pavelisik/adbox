import { Injectable, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbsStateService {
    private readonly _breadcrumbs = signal<MenuItem[]>([]);
    readonly breadcrumbs = this._breadcrumbs.asReadonly();

    set(breadcrumbs: MenuItem[]) {
        this._breadcrumbs.set(breadcrumbs);
    }

    clear() {
        this._breadcrumbs.set([]);
    }
}
