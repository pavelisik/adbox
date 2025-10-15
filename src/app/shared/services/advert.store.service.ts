import { Injectable, signal } from '@angular/core';
import { FullAdvert } from '@app/pages/advert/domains';

@Injectable({
    providedIn: 'root',
})
export class AdvertStoreService {
    private readonly _advert = signal<FullAdvert | null>(null);
    readonly advert = this._advert.asReadonly();

    set(advert: FullAdvert) {
        this._advert.set(advert);
    }

    update(partial: Partial<FullAdvert>) {
        const current = this._advert();
        if (current) {
            this._advert.set({ ...current, ...partial });
        }
    }

    clear() {
        this._advert.set(null);
    }
}
