import { Component, input, signal } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-image',
    imports: [SkeletonModule],
    templateUrl: './image.html',
    styleUrl: './image.scss',
})
export class Image {
    imageSrc = input<string | null>(null);
    alt = input<string | null>(null);
    isLoaded = signal<boolean>(false);

    onLoad() {
        this.isLoaded.set(true);
    }
}
