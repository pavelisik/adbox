import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-ad-grid-header',
    imports: [SelectModule, ReactiveFormsModule],
    templateUrl: './ad-grid-header.html',
    styleUrl: './ad-grid-header.scss',
})
export class AdGridHeader {
    fb = inject(FormBuilder);

    sortTypes = [
        { value: 'newest', name: 'Новизне' },
        { value: 'price', name: 'Цене' },
        { value: 'date', name: 'Дате' },
    ];

    sortForm = this.fb.group({
        sort: this.fb.control(this.sortTypes[0].value),
    });
}
