import { Component, computed, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SvgIcon } from '@app/shared/components';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';

export type CommentsFormTypes = 'main' | 'reply' | 'edit';

@Component({
    selector: 'app-comments-form',
    imports: [ReactiveFormsModule, TextareaModule, ButtonModule, SvgIcon],
    templateUrl: './comments-form.html',
    styleUrl: './comments-form.scss',
})
export class CommentsForm {
    private readonly fb = inject(FormBuilder);

    type = input<CommentsFormTypes>('main');
    activeId = input<string | null>(null);
    toUser = input<string | null>(null);
    initialText = input<string | null>(null);
    submitLabel = input<string>('Отправить');
    formSubmit = output<string>();
    formCancel = output<void>();

    isDataSame = computed(() => {
        return this.textValue() === this.initialText();
    });

    constructor() {
        effect(() => {
            const text = this.initialText();
            const activeId = this.activeId();
            if (text) {
                this.form.patchValue({ text });
            }
        });
    }

    form = this.fb.group({
        text: ['', [Validators.required, Validators.maxLength(500)]],
    });

    textValue = toSignal(this.form.controls['text'].valueChanges, {
        initialValue: this.initialText() || this.form.controls['text'].value,
    });

    onSubmit() {
        if (this.form.invalid) return;
        this.formSubmit.emit(this.textValue() || '');
        this.form.reset();
    }

    onCancel() {
        this.formCancel.emit();
        this.form.reset();
    }
}
