import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalUserStoreService } from './local-user.store.service';
import { LocalUserData } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class LocalUserService {
    private readonly cookies = inject(CookieService);
    private readonly store = inject(LocalUserStoreService);

    private readonly COOKIE_PREFIX = 'localUserData_';

    // загрузка данных пользователя из cookies
    loadDataFromCookie(userId: string) {
        const key = this.COOKIE_PREFIX + userId;
        const raw = this.cookies.get(key);
        if (raw) {
            try {
                this.store.setLocalUser(JSON.parse(raw));
            } catch {
                this.cookies.delete(key, '/');
                this.store.clearLocalUser();
            }
        } else {
            this.store.clearLocalUser();
        }
    }

    // cохранение данных пользователя в cookies
    saveDataToCookie(userId: string) {
        const key = this.COOKIE_PREFIX + userId;
        const data = this.store.localUser();
        if (data) {
            this.cookies.set(key, JSON.stringify(data), { expires: 365, path: '/' });
        }
    }

    // обновление части данных пользователя (в сторе и в cookies)
    updateData(userId: string, partial: Partial<LocalUserData>) {
        this.store.updateLocalUser(partial);
        this.saveDataToCookie(userId);
    }

    // очистка данных в сторе
    clearStore() {
        this.store.clearLocalUser();
    }

    // удаление данных пользователя из cookies
    deleteDataFromCookie(userId: string) {
        this.cookies.delete(this.COOKIE_PREFIX + userId, '/');
    }
}
