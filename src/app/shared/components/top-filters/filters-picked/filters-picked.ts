import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { map } from 'rxjs';

@Component({
    selector: 'app-filters-picked',
    imports: [ButtonModule],
    templateUrl: './filters-picked.html',
    styleUrl: './filters-picked.scss',
})
export class FiltersPicked {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    searchQuery = toSignal(this.route.queryParams.pipe(map((p) => p['search'] ?? '')), {
        initialValue: '',
    });

    catName = toSignal(this.route.queryParams.pipe(map((p) => p['catName'] ?? '')), {
        initialValue: '',
    });

    // очищаем параметр из строки запроса
    clearQuery(params: string[]) {
        const queryParams = { ...this.route.snapshot.queryParams };
        params.forEach((param) => delete queryParams[param]);
        this.router.navigate(['/adverts'], {
            queryParams,
        });
    }
}
