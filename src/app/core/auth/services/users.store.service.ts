import { Injectable, signal } from '@angular/core';
import { User } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class UsersStoreService {
    private readonly _authUser = signal<User | null>(null);
    readonly authUser = this._authUser.asReadonly();

    setAuthUser(user: User | null) {
        this._authUser.set(user);
    }

    updateAuthUser(partial: Partial<User>) {
        const current = this._authUser();
        if (current) {
            this._authUser.set({ ...current, ...partial });
        }
    }

    clearAuthUser() {
        this._authUser.set(null);
    }
}
