import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LocalUserService, UserFacade } from '@app/core/auth/services';
import { ConfirmService } from '@app/core/confirmation';
import { NotificationService } from '@app/core/notification';
import { AddressInput } from '@app/shared/components/forms/address-input/address-input';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-address-block',
    imports: [ButtonModule, AddressInput, ReactiveFormsModule],
    templateUrl: './address-block.html',
    styleUrl: './address-block.scss',
})
export class AddressBlock {
    private readonly userFacade = inject(UserFacade);

    control = input.required<FormControl<string>>();
    invalid = input<boolean>(false);
    isDataLoading = input<boolean>(false);

    isAddressInputVisible = signal<boolean>(true);

    readonly currentUser = this.userFacade.currentUser;
    readonly userAddress = computed(() => this.currentUser()?.address);

    constructor() {
        // не отображаем ввод адреса после загрузки, если адрес совпадает с сохраненным и не пустой
        effect(() => {
            const isDataLoading = this.isDataLoading();
            if (!isDataLoading) {
                if (this.isAddressInputSame() && !this.isAddressInputEmpty()) {
                    this.addressInputHide();
                }
            }
        });

        // отображаем ввод адреса при ошибках валидации
        effect(() => {
            const invalid = this.invalid();
            if (invalid) {
                this.addressInputShow();
            }
        });
    }

    onLabelButtonClick() {
        const address = this.userAddress();
        if (address) {
            this.addressInputHide();
            setTimeout(() => {
                this.control().setValue(address);
            }, 200);
        }
    }

    onChangeButtonClick() {
        this.control().setValue('');
        this.addressInputShow();
    }

    addressInputShow() {
        this.isAddressInputVisible.set(true);
    }

    private addressInputHide() {
        this.isAddressInputVisible.set(false);
    }

    private isAddressInputEmpty(): boolean {
        return !this.control().value;
    }

    private isAddressInputSame(): boolean {
        return this.control().value === this.userAddress();
    }
}
