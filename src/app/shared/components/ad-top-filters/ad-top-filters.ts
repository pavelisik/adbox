import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { PickedFilters } from './picked-filters/picked-filters';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AdvertsQueryParams } from '@app/pages/adverts-list/domains';
import { map } from 'rxjs';

@Component({
    selector: 'app-ad-top-filters',
    imports: [SelectModule, ReactiveFormsModule, PickedFilters],
    templateUrl: './ad-top-filters.html',
    styleUrl: './ad-top-filters.scss',
})
export class AdTopFilters {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    advertsCount = input<number | null>(null);

    readonly queryParams = toSignal(this.route.queryParams, {
        initialValue: {} as AdvertsQueryParams,
    });

    sortTypes = [
        { value: 'date', name: 'По дате' },
        { value: 'cheaper', name: 'Дешевле' },
        { value: 'expensive', name: 'Дороже' },
    ];

    sortForm = this.fb.group({
        sort: this.fb.control('date'),
    });

    readonly sortValue = toSignal(this.sortForm.valueChanges.pipe(map((value) => value.sort)), {
        initialValue: this.queryParams().sort ?? this.sortForm.value?.sort ?? 'date',
    });

    constructor() {
        // считываем значение типа сортировки из параметров в форму
        this.sortForm.patchValue({ sort: this.queryParams().sort ?? 'date' });

        // при выборе типа сортировки в форме - переходим с заданными параметрами
        effect(() => {
            const sort = this.sortValue();
            const currentSort = this.queryParams().sort ?? 'date';
            if (sort === currentSort) return;

            if (sort === 'date') {
                const queryParams = { ...this.route.snapshot.queryParams };
                delete queryParams['sort'];
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams,
                });
            } else {
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: { sort },
                    queryParamsHandling: 'merge',
                });
            }
        });
    }
}
