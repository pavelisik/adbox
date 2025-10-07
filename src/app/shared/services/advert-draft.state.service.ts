import { effect, Injectable, signal } from '@angular/core';
import { NewAdvertRequest } from '@app/pages/adverts-list/domains';

const ADVERT_DRAFT_KEY = 'advertDraft';

@Injectable({
    providedIn: 'root',
})
export class AdvertDraftStateService {
    private readonly _advertDraft = signal<Partial<NewAdvertRequest>>({});
    readonly advertDraft = this._advertDraft.asReadonly();

    constructor() {
        this.loadFromStorage();
        effect(() => {
            const value = this._advertDraft();
            localStorage.setItem(ADVERT_DRAFT_KEY, JSON.stringify(value));
        });
    }

    // загрузка черновика в стейт из localStorage
    private loadFromStorage() {
        const savedDraft = localStorage.getItem(ADVERT_DRAFT_KEY);
        if (savedDraft) {
            try {
                this._advertDraft.set(JSON.parse(savedDraft));
            } catch {
                localStorage.removeItem(ADVERT_DRAFT_KEY);
            }
        }
    }

    // удаление черновика из localStorage
    private removeFromStorage() {
        localStorage.removeItem(ADVERT_DRAFT_KEY);
    }

    updateData(partialDraft: Partial<NewAdvertRequest>) {
        this._advertDraft.update((currentDraft) => ({ ...currentDraft, ...partialDraft }));
    }

    clear() {
        this.removeFromStorage();
        this._advertDraft.set({});
    }
}
