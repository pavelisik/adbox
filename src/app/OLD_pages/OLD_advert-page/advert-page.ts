import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvertService } from '@app/data/services/advert-service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { switchMap } from 'rxjs';
import { Breadcrumbs } from '@app/shared/components/breadcrumbs/breadcrumbs';

@Component({
    selector: 'app-advert-page',
    imports: [AsyncPipe, JsonPipe, BreadcrumbModule, Breadcrumbs],
    templateUrl: './advert-page.html',
    styleUrl: './advert-page.scss',
})
export class AdvertPage {
    advertService = inject(AdvertService);
    rout = inject(ActivatedRoute);
    city = 'Севастополь';

    advert$ = this.rout.params.pipe(
        switchMap(({ id }) => {
            return this.advertService.getAdvert(id);
        })
    );

    breadcrumbsItems = [{ label: this.city }, { label: 'Недвижимость' }, { label: 'Дома' }];
}
