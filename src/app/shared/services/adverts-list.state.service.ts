import { Injectable, signal } from '@angular/core';
import { ShortAdvert } from '@app/pages/adverts-list/domains';

@Injectable({
    providedIn: 'root',
})
export class AdvertsListStateService {
    private readonly _advertsList = signal<ShortAdvert[]>([]);
    readonly advertsList = this._advertsList.asReadonly();

    set(advertsList: ShortAdvert[]) {
        this._advertsList.set(advertsList);
    }

    clear() {
        this._advertsList.set([]);
    }
}
