import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalUserStateService } from './local-user.state.service';
import { LocalUserData } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class LocalUserService {
    private readonly cookies = inject(CookieService);
    private readonly localUserState = inject(LocalUserStateService);

    private readonly COOKIE_PREFIX = 'localUserData_';

    // загрузка данных пользователя из cookies
    loadDataFromCookie(userId: string) {
        const key = this.COOKIE_PREFIX + userId;
        const raw = this.cookies.get(key);
        if (raw) {
            try {
                this.localUserState.set(JSON.parse(raw));
            } catch {
                this.cookies.delete(key, '/');
                this.localUserState.clear();
            }
        } else {
            this.localUserState.clear();
        }
    }

    // cохранение данных пользователя в cookies
    saveDataToCookie(userId: string) {
        const key = this.COOKIE_PREFIX + userId;
        const data = this.localUserState.localUser();
        if (data) {
            this.cookies.set(key, JSON.stringify(data), { expires: 365, path: '/' });
        }
    }

    // обновление части данных пользователя (в сторе и в cookies)
    updateData(userId: string, partial: Partial<LocalUserData>) {
        this.localUserState.update(partial);
        this.saveDataToCookie(userId);
    }

    // очистка данных в сторе
    clearState() {
        this.localUserState.clear();
    }

    // удаление данных пользователя из cookies
    deleteDataFromCookie(userId: string) {
        this.cookies.delete(this.COOKIE_PREFIX + userId, '/');
    }
}
