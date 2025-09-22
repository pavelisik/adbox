import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { PickedFilters } from './picked-filters/picked-filters';

@Component({
    selector: 'app-ad-top-filters',
    imports: [SelectModule, ReactiveFormsModule, PickedFilters],
    templateUrl: './ad-top-filters.html',
    styleUrl: './ad-top-filters.scss',
})
export class AdTopFilters {
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
