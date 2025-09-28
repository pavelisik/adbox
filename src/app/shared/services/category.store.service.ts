import { inject, Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { CategoryService } from '@app/shared/services/category.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { transformCategories } from '@app/shared/utils';

@Injectable({
    providedIn: 'root',
})
export class CategoryStore {
    private readonly categoryService = inject(CategoryService);

    private readonly allCategories$ = this.categoryService.getAllCategories().pipe(shareReplay(1));

    readonly allCategories = toSignal(
        this.allCategories$.pipe(map((cats) => transformCategories(cats))),
        { initialValue: [] },
    );
}
