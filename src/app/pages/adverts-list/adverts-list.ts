import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AdGrid } from '@app/shared/components';
import { AdvertService } from '@app/shared/services';

@Component({
    selector: 'app-adverts-list',
    imports: [ButtonModule, AdGrid, AsyncPipe],
    templateUrl: './adverts-list.html',
    styleUrl: './adverts-list.scss',
})
export class AdvertsList {
    advertService = inject(AdvertService);

    adverts$ = this.advertService.searchAdverts(
        {
            search: '',
            showNonActive: true,
            category: 'f2de4a69-1f28-4264-8f11-86b6f85d7b77',
        },
        10,
    );
}
