import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvertService } from '@app/data/services/advert-service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { switchMap } from 'rxjs';

@Component({
    selector: 'app-advert-page',
    imports: [AsyncPipe, JsonPipe],
    templateUrl: './advert-page.html',
    styleUrl: './advert-page.scss',
})
export class AdvertPage {
    advertService = inject(AdvertService);
    rout = inject(ActivatedRoute);

    advert$ = this.rout.params.pipe(
        switchMap(({ id }) => {
            return this.advertService.getAdvert(id);
        })
    );
}
