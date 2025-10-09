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
            switch (controlName) {
                case 'login':
                    return 'Введите логин';
                case 'name':
                    return 'Введите имя';
                case 'password':
                case 'newPassword':
                    return 'Введите пароль';
                case 'confirmPassword':
                    return 'Подтвердите пароль';
                case 'category':
                    return 'Выберите категорию';
                case 'title':
                    return 'Введите название объявления';
                case 'address':
                    return 'Введите адрес';
                case 'price':
                    return 'Введите цену';
                case 'phone':
                    return 'Введите номер телефона';
                default:
                    return 'Заполните поле';
            }
        }

        if (control.errors['minlength']) {
            const requiredLength = control.errors['minlength'].requiredLength;
            const symbolWord = ['login', 'name', 'title'].includes(controlName)
                ? 'символа'
                : 'символов';
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

        if (control.errors['max']) {
            if (controlName === 'price') {
                return `Слишком дорого`;
            }
        }

        if (control.errors['email']) {
            return 'Несуществующий e-mail';
        }

        return 'Неверное значение';
    };
}
