import { Injectable, signal } from '@angular/core';
import { User } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class UsersStoreService {
    private readonly _currentUser = signal<User | null>(null);
    readonly currentUser = this._currentUser.asReadonly();

    setCurrentUser(user: User | null) {
        this._currentUser.set(user);
    }

    clearCurrentUser() {
        this._currentUser.set(null);
    }
}
