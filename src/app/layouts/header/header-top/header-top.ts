import { Component } from '@angular/core';
import { SvgIcon } from '@app/common-ui/components/svg-icon/svg-icon';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-header-top',
    imports: [SvgIcon, ButtonModule],
    templateUrl: './header-top.html',
    styleUrl: './header-top.scss',
})
export class HeaderTop {}
