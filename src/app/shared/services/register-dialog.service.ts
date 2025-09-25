import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class RegisterDialogService {
    router = inject(Router);
    registerDialogOpen = signal<boolean>(false);

    openRegisterDialog() {
        this.registerDialogOpen.set(true);
    }

    closeRegisterDialog() {
        this.registerDialogOpen.set(false);
    }
}
