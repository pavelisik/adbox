import { Component, input, signal } from '@angular/core';
import { ImageSkeleton } from '@app/shared/components/skeletons';

@Component({
    selector: 'app-image',
    imports: [ImageSkeleton],
    templateUrl: './image.html',
    styleUrl: './image.scss',
})
export class Image {
    imageSrc = input<string | null>(null);
    alt = input<string | null>(null);

    readonly isLoaded = signal<boolean>(false);

    onLoad() {
        this.isLoaded.set(true);
    }
}
