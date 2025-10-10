import { Injectable, signal } from '@angular/core';
import { LocalUserData } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class LocalUserStoreService {
    private readonly _localUser = signal<LocalUserData | null>(null);
    readonly localUser = this._localUser.asReadonly();

    setLocalUser(user: LocalUserData | null) {
        this._localUser.set(user);
    }

    updateLocalUser(partial: Partial<LocalUserData>) {
        this._localUser.update((current) => ({ ...current, ...partial }));
    }

    clearLocalUser() {
        this._localUser.set({});
    }
}
