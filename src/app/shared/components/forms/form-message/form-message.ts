import { Component, computed, effect, input, model, signal } from '@angular/core';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-form-message',
    imports: [MessageModule],
    templateUrl: './form-message.html',
    styleUrl: './form-message.scss',
})
export class FormMessage {
    readonly success = model<string | null>(null);
    readonly error = model<string | null>(null);
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

    constructor() {
        effect(() => {
            // без этого сброса через таймер из-за [life] не сбрасывались сообщения
            if (this.message()) {
                const timer = this.life() + 500;
                setTimeout(() => {
                    this.success.set(null);
                    this.error.set(null);
                }, timer);
            }
        });
    }
}
