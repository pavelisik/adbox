import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { LocalUserService, UsersFacade } from '@app/core/auth/services';
import { ConfirmService } from '@app/core/confirmation';
import { NotificationService } from '@app/core/notification';
import { AddressInput } from '@app/shared/components/forms/address-input/address-input';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-address-block',
    imports: [ButtonModule, AddressInput, ɵInternalFormsSharedModule, ReactiveFormsModule],
    templateUrl: './address-block.html',
    styleUrl: './address-block.scss',
})
export class AddressBlock {
    private readonly usersFacade = inject(UsersFacade);
    private readonly localUserService = inject(LocalUserService);
    private readonly confirm = inject(ConfirmService);
    private readonly notify = inject(NotificationService);

    control = input.required<FormControl<string>>();
    invalid = input<boolean>(false);
    isAdvertEdit = input<boolean>(false);
    isDataLoading = input<boolean>(false);

    isAddressInputVisible = signal<boolean>(true);

    readonly currentUser = this.usersFacade.currentUser;
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

    isAddressInputEmpty(): boolean {
        return !this.control().value;
    }

    isAddressInputSame(): boolean {
        return this.control().value === this.userAddress();
    }

    addAddressToForm() {
        const address = this.userAddress();
        if (address) {
            this.control().setValue(address);
            this.addressInputHide();
        }
    }

    addressInputShow() {
        this.isAddressInputVisible.set(true);
    }

    private addressInputHide() {
        this.isAddressInputVisible.set(false);
    }

    addressUpdate() {
        const user = this.currentUser();
        if (!user) return;

        const address = this.control().value;
        this.localUserService.updateData(user.id, { address });
        if (!this.isAdvertEdit() || this.isAddressInputSame()) {
            this.addressInputHide();
        }

        this.notify.success('Обновление данных', 'Адрес успешно сохранен');
    }

    addressDelete() {
        this.confirm.confirm('deleteAddress', () => {
            const user = this.currentUser();
            if (!user) return;

            this.localUserService.updateData(user.id, { address: '' });
            this.addressInputShow();
            this.control().setValue('');

            this.notify.success('Обновление данных', 'Адрес успешно удален');
        });
    }
}
