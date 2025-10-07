import { Component, computed, input } from '@angular/core';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-form-message',
    imports: [MessageModule],
    templateUrl: './form-message.html',
    styleUrl: './form-message.scss',
})
export class FormMessage {
    readonly success = input<string | null>(null);
    readonly error = input<string | null>(null);
    readonly lifeSuccess = input<number>(3000);
    readonly lifeError = input<number>(3000);

    readonly message = computed(() => this.error() || this.success());
    readonly messageType = computed(() => (this.success() ? 'success' : 'error'));
    readonly life = computed(() =>
        this.messageType() === 'success' ? this.lifeSuccess() : this.lifeError(),
    );
    readonly icon = computed(() =>
        this.messageType() === 'success' ? 'pi pi-check-circle' : 'pi pi-times-circle',
    );
}
