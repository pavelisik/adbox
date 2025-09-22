import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { FiltersPicked } from './filters-picked/filters-picked';

@Component({
    selector: 'app-top-filters',
    imports: [SelectModule, ReactiveFormsModule, FiltersPicked],
    templateUrl: './top-filters.html',
    styleUrl: './top-filters.scss',
})
export class TopFilters {
    fb = inject(FormBuilder);
    advertsCount = input<number | null>(null);

    sortTypes = [
        { value: 'newest', name: 'Новизне' },
        { value: 'price', name: 'Цене' },
        { value: 'date', name: 'Дате' },
    ];

    sortForm = this.fb.group({
        sort: this.fb.control(this.sortTypes[0].value),
    });
}
