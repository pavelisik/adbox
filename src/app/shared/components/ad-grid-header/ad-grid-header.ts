import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { AdvertsCountPipe } from '@app/shared/pipes';

@Component({
    selector: 'app-ad-grid-header',
    imports: [SelectModule, ReactiveFormsModule, AdvertsCountPipe],
    templateUrl: './ad-grid-header.html',
    styleUrl: './ad-grid-header.scss',
})
export class AdGridHeader {
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
