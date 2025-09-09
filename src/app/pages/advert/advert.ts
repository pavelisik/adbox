import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { switchMap } from 'rxjs';
import { Breadcrumbs } from '@app/shared/components/breadcrumbs/breadcrumbs';
import { AdvertService } from '@app/shared/services/advert.service';

@Component({
    selector: 'app-advert',
    imports: [AsyncPipe, JsonPipe, BreadcrumbModule, Breadcrumbs],
    templateUrl: './advert.html',
    styleUrl: './advert.scss',
})
export class Advert {
    advertService = inject(AdvertService);
    rout = inject(ActivatedRoute);

    advert$ = this.rout.params.pipe(
        switchMap(({ id }) => {
            return this.advertService.getAdvert(id);
        })
    );
}
