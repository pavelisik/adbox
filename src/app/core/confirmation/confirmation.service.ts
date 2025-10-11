import { Injectable, inject } from '@angular/core';
import { ConfirmActionType, CONFIRM_MESSAGES } from '@app/core/confirmation/constants';
import { ConfirmationService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class ConfirmService {
    private readonly confirmationService = inject(ConfirmationService);

    confirm(type: ConfirmActionType, onAccept: () => void, onReject?: () => void) {
        const { header, message } = CONFIRM_MESSAGES[type];
        this.confirmationService.confirm({
            header,
            message,
            acceptLabel: 'Да',
            rejectLabel: 'Отмена',
            accept: onAccept,
            reject: onReject,
        });
    }
}
