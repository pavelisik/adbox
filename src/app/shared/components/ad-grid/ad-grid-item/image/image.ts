import { Component, computed, inject, input, signal } from '@angular/core';
import { AuthStateService, UserFacade } from '@app/core/auth/services';
import { NotificationService } from '@app/core/notification';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-image',
    imports: [SkeletonModule],
    templateUrl: './image.html',
    styleUrl: './image.scss',
})
export class Image {
    private readonly authStateService = inject(AuthStateService);
    private readonly userFacade = inject(UserFacade);
    private readonly notify = inject(NotificationService);

    imageSrc = input<string | null>(null);
    alt = input<string | null>(null);
    advertId = input<string | null>(null);

    readonly isLoaded = signal<boolean>(false);
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

    onLoad() {
        this.isLoaded.set(true);
    }

    // добавление или удаление из избранного с задержкой
    toggleFavorite(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        if (this.isUpdatingFavorite()) return;
        this.isUpdatingFavorite.set(true);

        const advertId = this.advertId();
        if (!advertId) return;

        if (this.isFavorite()) {
            this.userFacade.removeAdvertFromFavorite(advertId);
            this.notify.success('Обновление данных', 'Объявление удалено из избранного');
        } else {
            this.userFacade.addAdvertToFavorite(advertId);
            this.notify.success('Обновление данных', 'Объявление добавлено в избранное');
        }

        setTimeout(() => this.isUpdatingFavorite.set(false), 1000);
    }
}
