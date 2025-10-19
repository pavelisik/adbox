import { Injectable, signal } from '@angular/core';
import { User } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class UserStateService {
    private readonly _authUser = signal<User | null>(null);
    readonly authUser = this._authUser.asReadonly();

    set(user: User | null) {
        this._authUser.set(user);
    }

    update(partial: Partial<User>) {
        const current = this._authUser();
        if (current) {
            this._authUser.set({ ...current, ...partial });
        }
    }

    clear() {
        this._authUser.set(null);
    }
}
