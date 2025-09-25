import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly messageService = inject(MessageService);

    success(summary: string, detail: string) {
        this.messageService.add({ severity: 'success', summary, detail });
    }

    info(summary: string, detail: string) {
        this.messageService.add({ severity: 'info', summary, detail });
    }

    error(summary: string, detail: string) {
        this.messageService.add({ severity: 'error', summary, detail });
    }
}
