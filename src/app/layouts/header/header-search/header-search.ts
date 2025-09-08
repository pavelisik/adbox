import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SvgIcon } from '@app/common-ui/components/svg-icon/svg-icon';

@Component({
    selector: 'app-header-search',
    imports: [SvgIcon, InputTextModule, ButtonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './header-search.html',
    styleUrl: './header-search.scss',
})
export class HeaderSearch {
    fb = inject(FormBuilder);

    searchForm = this.fb.nonNullable.group({
        search: [''],
    });

    onSearch() {
        const value = this.searchForm.value.search?.trim();
        if (!value) return;

        console.log(`Поиск данных: ${value}`);
    }
}
