import { Component, effect, input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-control-error',
    imports: [MessageModule],
    templateUrl: './control-error.html',
    styleUrl: './control-error.scss',
})
export class ControlError {
    form = input<FormGroup | null>(null);
    controlName = input<string | null>(null);
    isSubmitted = input<boolean>(false);

    errorMessage = () => {
        const form = this.form();
        const controlName = this.controlName();
        const isSubmitted = this.isSubmitted();
        if (!form || !controlName) return null;

        const control = form.get(controlName);
        if (!control || !control.errors || !isSubmitted) return null;

        if (control.errors['required']) {
            return controlName === 'name' ? 'Введите имя' : 'Введите логин';
        }

        return 'Неверное значение';
    };
}
