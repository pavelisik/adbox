import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { of, switchMap, tap } from 'rxjs';
import { Breadcrumbs } from '@app/shared/components';
import { AdvertService, CategoryService } from '@app/shared/services';
import { PricePipe } from '@app/shared/pipes';
import { ButtonModule } from 'primeng/button';
import { SvgIcon } from '@app/shared/components';
import { ImageGallery } from '@app/shared/components/image-gallery/image-gallery';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MenuItem } from 'primeng/api';
import { BreadcrumbsService } from '@app/shared/services/breadcrumbs.service';
import { FullAdvert } from '@app/pages/advert/domains';

@Component({
    selector: 'app-advert',
    imports: [BreadcrumbModule, Breadcrumbs, PricePipe, ButtonModule, SvgIcon, ImageGallery],
    templateUrl: './advert.html',
    styleUrl: './advert.scss',
})
export class Advert implements OnInit {
    private advertService = inject(AdvertService);
    private categoryService = inject(CategoryService);
    private breadcrumbsService = inject(BreadcrumbsService);
    route = inject(ActivatedRoute);

    advert = signal<FullAdvert | null>(null);
    parentId = signal<string | null>(null);
    breadcrumbs = signal<MenuItem[]>([]);

    advert$ = this.route.params.pipe(
        switchMap(({ id }) => {
            return this.advertService.getAdvert(id);
        }),
        tap((advert) => {
            this.advert.set(advert ?? null);
            this.parentId.set(advert.category?.parentId ?? null);
        }),
        takeUntilDestroyed()
    );

    category$ = toObservable(this.parentId).pipe(
        switchMap((parentId) => {
            if (!parentId || parentId === '00000000-0000-0000-0000-000000000000') {
                return of(null);
            }
            return this.categoryService.getCategory(parentId);
        }),
        tap((cat) => {
            if (this.advert()) {
                this.breadcrumbs.set(
                    this.breadcrumbsService.buildForAdvert(this.advert()!, cat?.name)
                );
            }
        }),
        takeUntilDestroyed()
    );

    ngOnInit() {
        this.advert$.subscribe();
        this.category$.subscribe();
    }
}
