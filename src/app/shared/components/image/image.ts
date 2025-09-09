import { Component, computed, input, Input } from '@angular/core';
import { environment } from '@env/environment';

@Component({
    selector: 'app-image',
    imports: [],
    templateUrl: './image.html',
    styleUrl: './image.scss',
})
export class Image {
    imageSrc = input<string | null>(null);
    alt = input<string | null>(null);

    // imageId = input<string>('');
    // imageUrl = computed(() => `${environment.baseApiURL}/Images/${this.imageId()}`);
}
