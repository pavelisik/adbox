import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AdGrid } from '@app/common-ui/components/ad-grid/ad-grid';

@Component({
    selector: 'app-home-page',
    imports: [ButtonModule, AdGrid],
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss',
})
export class HomePage {}
