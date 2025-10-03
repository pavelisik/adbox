import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class InfoDialogService {
    infoDialogOpen = signal<boolean>(false);

    openDialog() {
        this.infoDialogOpen.set(true);
    }

    closeDialog() {
        this.infoDialogOpen.set(false);
    }
}
