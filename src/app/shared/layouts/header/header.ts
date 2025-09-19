import { Component } from '@angular/core';
import { SearchBar, TopBar } from '@app/shared/components';

@Component({
    selector: 'app-header',
    imports: [TopBar, SearchBar],
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header {}
