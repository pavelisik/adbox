import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService, UserFacade } from '@app/core/auth/services';

@Component({
    selector: 'app-image-buttons',
    imports: [],
    templateUrl: './image-buttons.html',
    styleUrl: './image-buttons.scss',
})
export class ImageButtons {
    private readonly router = inject(Router);
    private readonly authStateService = inject(AuthStateService);
    private readonly userFacade = inject(UserFacade);

    readonly advertId = input<string | null>(null);
    readonly addFavorite = output<{ advertId: string }>();
    readonly removeFavorite = output<{ advertId: string }>();
    readonly deleteAdvert = output<{ advertId: string }>();

    readonly isUpdatingFavorite = signal<boolean>(false);

    readonly isAuth = this.authStateService.isAuth;

    readonly isFavorite = computed(() => {
        const advertId = this.advertId();
        if (!advertId) return false;
        return this.userFacade.isAdvertInFavorites(advertId);
    });

    readonly isMyAdvert = computed(() => {
        const advertId = this.advertId();
        const currentUser = this.userFacade.currentUser();
        if (!advertId || !currentUser) return false;
        return currentUser.adverts.some((advert) => advert.id === advertId);
    });

    // добавление или удаление из избранного с задержкой
    toggleFavorite(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();

        if (this.isUpdatingFavorite()) return;
        this.isUpdatingFavorite.set(true);

        const advertId = this.advertId();
        if (!advertId) return;

        if (this.isFavorite()) {
            this.removeFavorite.emit({ advertId });
        } else {
            this.addFavorite.emit({ advertId });
        }

        setTimeout(() => this.isUpdatingFavorite.set(false), 1000);
    }

    // редактирование объявления
    onEditAdvert(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/user/advert-edit/', this.advertId()]);
    }

    // удаление объявления
    onDeleteAdvert(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();

        const advertId = this.advertId();
        if (!advertId) return;

        this.deleteAdvert.emit({ advertId });
    }
}
