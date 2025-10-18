import { Component, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-comments-form',
    imports: [ReactiveFormsModule, TextareaModule, ButtonModule],
    templateUrl: './comments-form.html',
    styleUrl: './comments-form.scss',
})
export class CommentsForm {
    private readonly fb = inject(FormBuilder);

    initialText = input<string | null>(null);
    submitLabel = input<string>('Отправить');
    placeholder = input<string>('Ваш комментарий');
    formSubmit = output<string>();
    formCancel = output<void>();

    constructor() {
        effect(() => {
            const text = this.initialText();
            if (text) {
                this.form.patchValue({ text });
            }
        });
    }

    form = this.fb.group({
        text: ['', [Validators.required, Validators.maxLength(1000)]],
    });

    get textValue() {
        return this.form.value.text?.trim() ?? '';
    }

    onSubmit() {
        if (this.form.invalid) return;
        this.formSubmit.emit(this.textValue);
        this.form.reset();
    }

    onCancel() {
        this.formCancel.emit();
        this.form.reset();
    }
}
