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

    // раньше внутри формы была вот такая функция
    // вывод ошибок валидации для каждого поля
    // getControlError(controlName: string): string | null {
    //     const control = this.settingsForm.get(controlName);
    //     if (!control || !control.errors || !this.isSubmitted()) return null;

    //     if (control.errors['required']) {
    //         return controlName === 'name' ? 'Введите имя' : 'Введите логин';
    //     }

    //     return 'Неверное значение';
    // }

    errorMessage = () => {
        const form = this.form();
        const controlName = this.controlName();
        const isSubmitted = this.isSubmitted();
        if (!form || !controlName) return null;

        const control = form.get(controlName);
        if (!control || !control.errors || !isSubmitted) return null;

        if (control.errors['required']) {
            switch (controlName) {
                case 'login':
                    return 'Введите логин';
                case 'name':
                    return 'Введите имя';
                case 'password':
                case 'currentPassword':
                case 'newPassword':
                    return 'Введите пароль';
                case 'confirmPassword':
                    return 'Подтвердите пароль';
                default:
                    return 'Заполните поле';
            }
        }

        if (control.errors['minlength']) {
            const requiredLength = control.errors['minlength'].requiredLength;
            const symbolWord = ['login', 'name'].includes(controlName) ? 'символа' : 'символов';
            return `Минимум ${requiredLength} ${symbolWord}`;
        }

        if (control.errors['maxlength']) {
            const requiredLength = control.errors['maxlength'].requiredLength;
            const symbolWord = ['login', 'name'].includes(controlName) ? 'символа' : 'символов';
            return `Максимум ${requiredLength} ${symbolWord}`;
        }

        if (control.errors['mismatch']) {
            return 'Пароли не совпадают';
        }

        return 'Неверное значение';
    };
}
