import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

export type DialogType = 'login' | 'register' | 'password' | 'info';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    readonly current = signal<DialogType | null>(null);

    confirmedPassword: WritableSignal<string | null> | null = null;
    userName: string = '';
    phoneNumber: string = '';

    open(
        type: DialogType,
        confirmedPassword?: WritableSignal<string | null>,
        userName?: string,
        phoneNumber?: string,
    ) {
        this.current.set(type);
        if (type === 'password') this.confirmedPassword = confirmedPassword ?? null;
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
}
