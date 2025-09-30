import { inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { User } from '@app/core/auth/domains';
import { AuthStateService, UsersService } from '@app/core/auth/services';
import { of, shareReplay, switchMap } from 'rxjs';

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
