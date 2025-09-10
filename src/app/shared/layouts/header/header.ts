import { Component } from '@angular/core';
import { HeaderTop } from './header-top/header-top';
import { HeaderSearch } from './header-search/header-search';

@Component({
    selector: 'app-header',
    imports: [HeaderTop, HeaderSearch],
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header {}
