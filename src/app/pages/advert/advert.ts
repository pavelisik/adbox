import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { switchMap } from 'rxjs';
import { Breadcrumbs } from '@app/shared/components';
import { AdvertService } from '@app/shared/services';
import { PricePipe } from '@app/shared/pipes';
import { ButtonModule } from 'primeng/button';
import { SvgIcon } from '@app/shared/components';
import { ImageGallery } from '@app/shared/components/image-gallery/image-gallery';

@Component({
    selector: 'app-advert',
    imports: [
        AsyncPipe,
        BreadcrumbModule,
        Breadcrumbs,
        PricePipe,
        ButtonModule,
        SvgIcon,
        ImageGallery,
    ],
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
