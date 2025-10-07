import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { filter, tap } from 'rxjs';

export type DialogType = 'login' | 'register' | 'password' | 'info' | 'terms-of-service';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    private readonly router = inject(Router);

    readonly current = signal<DialogType | null>(null);
    private skipClose = false;

    userName: string = '';
    phoneNumber: string = '';

    constructor() {
        // закрываем окно при навигации
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationStart),
                tap(() => {
                    if (!this.skipClose) {
                        this.close();
                    }
                    this.skipClose = false;
                }),
                takeUntilDestroyed(),
            )
            .subscribe();
    }

    open(type: DialogType, userName?: string, phoneNumber?: string) {
        this.current.set(type);
        if (type === 'info') {
            if (userName) this.userName = userName;
            if (phoneNumber) this.phoneNumber = phoneNumber;
        }
    }

    close() {
        this.current.set(null);
    }

    isOpen(type: DialogType): boolean {
        return this.current() === type;
    }

    skipNextClose() {
        this.skipClose = true;
    }
}
