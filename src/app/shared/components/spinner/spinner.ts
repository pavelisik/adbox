import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-spinner',
    imports: [ProgressSpinnerModule],
    templateUrl: './spinner.html',
    styleUrl: './spinner.scss',
})
export class Spinner {}
