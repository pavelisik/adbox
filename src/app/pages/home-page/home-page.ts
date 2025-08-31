import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-home-page',
    imports: [ButtonModule],
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss',
})
export class HomePage {}
