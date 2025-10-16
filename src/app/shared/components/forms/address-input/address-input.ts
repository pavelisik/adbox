import { forwardRef, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DadataService } from '@app/shared/services';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { tap } from 'rxjs';

@Component({
    selector: 'app-address-input',
    imports: [AutoCompleteModule, FormsModule],
    templateUrl: './address-input.html',
    styleUrl: './address-input.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AddressInput),
            multi: true,
        },
    ],
})
export class AddressInput implements ControlValueAccessor {
    private readonly dadataService = inject(DadataService);
    private readonly destroyRef = inject(DestroyRef);

    isLoading = input<boolean>(false);
    invalid = input<boolean>(false);

    readonly addressSuggestions = signal<string[]>([]);

    value: string | null = null;
    isDisabled = false;

    private onChange: (value: string | null) => void = () => {};
    private onTouched: () => void = () => {};

    // поиск адреса с автокомплитом из DaData
    searchAddress(event: AutoCompleteCompleteEvent) {
        this.dadataService
            .getAddressStrings(event.query)
            .pipe(
                tap((res) => this.addressSuggestions.set(res)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    onInput(value: string) {
        this.value = value;
        this.onChange(value);
        this.onTouched();
    }

    // методы ControlValueAccessor
    writeValue(value: string) {
        this.value = value ?? '';
    }
    registerOnChange(fn: any) {
        this.onChange = fn;
    }
    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled: boolean) {
        this.isDisabled = isDisabled;
    }
}
