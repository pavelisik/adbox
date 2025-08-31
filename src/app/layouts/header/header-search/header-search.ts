import { Component } from '@angular/core';
import { SvgIcon } from '@app/common-ui/components/svg-icon/svg-icon';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-header-search',
    imports: [SvgIcon, ButtonModule],
    templateUrl: './header-search.html',
    styleUrl: './header-search.scss',
})
export class HeaderSearch {}
