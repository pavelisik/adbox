import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SvgIcon } from '@app/shared/components';
import { CategoryMenu } from './category-menu/category-menu';
import { PopoverModule } from 'primeng/popover';

@Component({
    selector: 'app-header-search',
    imports: [
        SvgIcon,
        InputTextModule,
        ButtonModule,
        ReactiveFormsModule,
        RouterLink,
        CategoryMenu,
        PopoverModule,
    ],
    templateUrl: './header-search.html',
    styleUrl: './header-search.scss',
})
export class HeaderSearch {
    private router = inject(Router);
    fb = inject(FormBuilder);
    menuButtonIcon = 'list-nested';

    onMenuShow() {
        this.menuButtonIcon = 'close';
    }

    onMenuHide() {
        this.menuButtonIcon = 'list-nested';
    }

    searchForm = this.fb.nonNullable.group({
        search: [''],
    });

    onSearch() {
        const value = this.searchForm.value.search?.trim();
        if (!value) return;

        this.router.navigate(['/adverts'], {
            queryParams: { search: value },
            queryParamsHandling: 'merge',
        });
    }
}
