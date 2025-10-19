import { Injectable, signal } from '@angular/core';
import { LocalUserData } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class LocalUserStateService {
    private readonly _localUser = signal<LocalUserData | null>(null);
    readonly localUser = this._localUser.asReadonly();

    set(user: LocalUserData | null) {
        this._localUser.set(user);
    }

    update(partial: Partial<LocalUserData>) {
        this._localUser.update((current) => ({ ...current, ...partial }));
    }

    clear() {
        this._localUser.set({});
    }
}
