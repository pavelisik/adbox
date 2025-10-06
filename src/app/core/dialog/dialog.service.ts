import { Injectable, signal } from '@angular/core';

export type DialogType = 'login' | 'register' | 'password' | 'info' | 'terms-of-service';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    readonly current = signal<DialogType | null>(null);

    userName: string = '';
    phoneNumber: string = '';

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
}
