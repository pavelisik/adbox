import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class InfoDialogService {
    router = inject(Router);
    infoDialogOpen = signal<boolean>(false);

    openDialog() {
        this.infoDialogOpen.set(true);
    }

    closeDialog() {
        this.infoDialogOpen.set(false);
    }
}
