import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SvgIcon } from '@app/shared/components';
import { CategoryMenu } from './category-menu/category-menu';
import { PopoverModule } from 'primeng/popover';

@Component({
    selector: 'app-search-bar',
    imports: [
        SvgIcon,
        InputTextModule,
        ButtonModule,
        ReactiveFormsModule,
        RouterLink,
        CategoryMenu,
        PopoverModule,
    ],
    templateUrl: './search-bar.html',
    styleUrl: './search-bar.scss',
})
export class SearchBar {
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    menuButtonIcon = 'list-nested';
    menuButtonActive = false;

    @ViewChild('categoryMenu') categoryMenu!: CategoryMenu;

    onMenuShow() {
        this.menuButtonActive = true;
        this.menuButtonIcon = 'close';
        this.categoryMenu.initActiveCategory();
    }

    onMenuHide() {
        this.menuButtonActive = false;
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

        this.searchForm.reset({ search: '' });
    }
}
