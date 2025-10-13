import { TestBed } from '@angular/core/testing';
import { AuthStateService } from './auth.state.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

describe('AuthState Service - сервис состояния авторизации (работа с токеном авторизации, синхронизация с cookie)', () => {
    let service: AuthStateService;
    let cookieService: jasmine.SpyObj<CookieService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        // создаем шпионы для методов
        cookieService = jasmine.createSpyObj('CookieService', ['get', 'set', 'delete']);
        router = jasmine.createSpyObj('Router', ['navigateByUrl']);

        // возвращаем пустую строку, чтобы тест начинался с отсутствующего токена
        cookieService.get.and.returnValue('');

        TestBed.configureTestingModule({
            providers: [
                AuthStateService,
                // подменяем реальные сервисы на созданные SpyObj
                { provide: CookieService, useValue: cookieService },
                { provide: Router, useValue: router },
            ],
        });

        service = TestBed.inject(AuthStateService);
    });

    describe('# общие тесты и состояние авторизации', () => {
        it('сервис создается', () => {
            expect(service).toBeTruthy();
        });

        it('isAuth возвращает false если токена нет', () => {
            expect(service.isAuth()).toBeFalse();
        });

        it('isAuth возвращает true после сохранения токена', () => {
            service.saveToken('token123', true);

            expect(service.isAuth()).toBeTrue();
        });
    });

    describe('# сохранение и удаление токена синхронно с cookie', () => {
        it('saveToken с rememberMe=treue сохраняет токен и устанавливает временный cookie', () => {
            service.saveToken('token123', true);

            // проверяем, что token обновился
            expect(service.token()).toBe('token123');
            // проверяем, что cookie установлена с правильным объектом опций
            expect(cookieService.set).toHaveBeenCalledWith('token', 'token123', {
                expires: 30,
                path: '/',
            });
        });

        it('saveToken с rememberMe=false сохраняет токен и устанавливает cookie без срока', () => {
            service.saveToken('xyz789', false);

            // проверяем, что token обновился
            expect(service.token()).toBe('xyz789');
            // проверяем, что cookie установлена с правильным объектом опций
            expect(cookieService.set).toHaveBeenCalledWith('token', 'xyz789', { path: '/' });
        });

        it('deleteToken очищает токен и cookie', () => {
            service.token.set('token123');
            service.deleteToken();

            // проверяем, что token обнулился
            expect(service.token()).toBeNull();
            // проверяем, что cookie удалена с тем же path, что был при установке
            expect(cookieService.delete).toHaveBeenCalledWith('token', '/');
        });
    });

    describe('# логика сохранения редиректа для навигации после успешной авторизации', () => {
        it('setRedirectUrl и clearRedirectUrl работают корректно', () => {
            service.setRedirectUrl('user/settings');
            expect(service.redirectUrl()).toBe('user/settings');

            service.clearRedirectUrl();
            expect(service.redirectUrl()).toBeNull();
        });

        it('redirectAfterLogin навигирует по redirectUrl и очищает его', () => {
            service.setRedirectUrl('user/settings');
            service.redirectAfterLogin();

            expect(router.navigateByUrl).toHaveBeenCalledWith('user/settings');
            expect(service.redirectUrl()).toBeNull();
        });

        it('redirectAfterLogin ничего не делает, если redirectUrl пустой', () => {
            service.clearRedirectUrl();
            service.redirectAfterLogin();

            expect(router.navigateByUrl).not.toHaveBeenCalled();
        });
    });
});
