import { Component, input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-spinner',
    imports: [ProgressSpinnerModule],
    templateUrl: './spinner.html',
    styleUrl: './spinner.scss',
})
export class Spinner {
    type = input<string>('small');
    width = input<string>('4');
    color = input<string>('var(--gray-300-color)');
    wrapHeight = input<string>('500px');
}
