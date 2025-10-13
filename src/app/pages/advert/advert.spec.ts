import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Advert } from './advert';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AdvertService, CategoryService, BreadcrumbsService } from '@app/shared/services';
import { UsersFacade } from '@app/core/auth/services';
import { AuthStateService } from '@app/core/auth/services';
import { DialogService } from '@app/core/dialog';
import { ConfirmService } from '@app/core/confirmation';
import { ActivatedRoute, Router } from '@angular/router';
import { FullAdvert } from '@app/pages/advert/domains';

// тестовые мок-данные для объявления
const mockAdvert: FullAdvert = {
    id: '4f3b9849-c8a4-4f34-af2a-f9d70feb60d5',
    name: 'Тестовое объявление',
    cost: 1000,
    description: 'Описание тестового объявления',
    created: '2025-10-13T11:14:05.849469Z',
    email: 'user@test.ru',
    isActive: true,
    category: {
        id: 'f2de4a69-1f28-4264-8f11-86b6f85d7b77',
        name: 'Дома',
        parentId: 'ec99b930-c589-4935-80bb-a14722a73226',
    },
    user: {
        id: 'e2bd9b02-6b36-4a3a-bdb2-238502cedcc3',
        name: 'Павел',
        login: 'pavel',
    },
    imagesIds: [
        'a1ea5065-0d21-4a30-ad8f-11d7e813a309',
        '2705666b-93b8-4828-8654-63421bfae8ba',
        '81f2265b-cd18-41e7-831f-e7bdcabc6aa4',
        '36aa0aea-524f-4660-9ec2-db0716e8f649',
        'd09f1887-cc68-48e3-a9d8-e22c44814cbc',
        'c75ec423-b404-439d-857a-9dcf7bb2dc78',
        'bd1aaab5-71db-421d-be25-968642b5a4a3',
        'bdb08ba1-36ac-4e63-a6f3-6fc50063d70b',
    ],
    location: 'Краснодарский край, Сочи, Курортный пр-т, 102, район Хостинский',
    phone: '+79998887766',
};

describe('Advert Component - компонент для отображения страницы со всеми данными объявления', () => {
    // экземпляр тестируемого компонента
    let component: Advert;
    // оболочка компонента
    let fixture: ComponentFixture<Advert>;
    // мок-объекты сервисов и роутера (шпионы jasmine.SpyObj)
    let advertService: jasmine.SpyObj<AdvertService>;
    let categoryService: jasmine.SpyObj<CategoryService>;
    let breadcrumbsService: jasmine.SpyObj<BreadcrumbsService>;
    let usersFacade: jasmine.SpyObj<UsersFacade>;
    let confirm: jasmine.SpyObj<ConfirmService>;
    let dialogService: jasmine.SpyObj<DialogService>;
    let authStateService: jasmine.SpyObj<AuthStateService>;
    let router: jasmine.SpyObj<Router>;

    // настройка тестового модуля и моков
    beforeEach(async () => {
        // для каждого внешнего сервиса создаем шпион-объекты-заменители с методами, которые компонент вызывает
        advertService = jasmine.createSpyObj('AdvertService', ['getAdvert', 'deleteAdvert']);
        categoryService = jasmine.createSpyObj('CategoryService', ['getCategory']);
        breadcrumbsService = jasmine.createSpyObj('BreadcrumbsService', ['buildForAdvert']);
        confirm = jasmine.createSpyObj('ConfirmService', ['confirm']);
        dialogService = jasmine.createSpyObj('DialogService', ['open']);
        authStateService = jasmine.createSpyObj('AuthStateService', ['isAuth']);
        router = jasmine.createSpyObj('Router', ['navigate']);
        // тут дополнительно передается свойство currentUser типа Signal, т.к. компонент ожидает сигнал usersFacade.currentUser
        usersFacade = jasmine.createSpyObj('UsersFacade', ['isMyAdvert', 'refreshAuthUser'], {
            currentUser: signal({ id: 'e2bd9b02-6b36-4a3a-bdb2-238502cedcc3' }),
        });

        // настройка тестового модуля
        await TestBed.configureTestingModule({
            imports: [Advert],
            // подменяем реальные сервисы на созданные SpyObj
            providers: [
                { provide: AdvertService, useValue: advertService },
                { provide: CategoryService, useValue: categoryService },
                { provide: BreadcrumbsService, useValue: breadcrumbsService },
                { provide: ConfirmService, useValue: confirm },
                { provide: DialogService, useValue: dialogService },
                { provide: AuthStateService, useValue: authStateService },
                { provide: Router, useValue: router },
                { provide: UsersFacade, useValue: usersFacade },
                // имитируем наличие route-параметра
                {
                    provide: ActivatedRoute,
                    useValue: { params: of({ id: '4f3b9849-c8a4-4f34-af2a-f9d70feb60d5' }) },
                },
            ],
        }).compileComponents();

        // создаем оболочку и экземпляр компонента
        fixture = TestBed.createComponent(Advert);
        component = fixture.componentInstance;
    });

    describe('# инициализация и базовые методы', () => {
        it('компонент создается', () => {
            expect(component).toBeTruthy();
        });

        it('при ngOnInit вызывает advertService.getAdvert и устанавливает advert', () => {
            // настраиваем шпиона getAdvert, чтобы при вызове он возвращал Observable с мок-данными (симуляция ответа от API)
            advertService.getAdvert.and.returnValue(of(mockAdvert));
            // вручную вызываем ngOnInit
            component.ngOnInit();

            // проверяем, что getAdvert был вызван с текущим id параметром
            expect(advertService.getAdvert).toHaveBeenCalledWith(
                '4f3b9849-c8a4-4f34-af2a-f9d70feb60d5',
            );
            // проверяем, что сигнал advert внутри компонента установлен тем объектом, который пришел из сервиса
            expect(component.advert()).toEqual(mockAdvert);
        });

        it('корректно проверяет isMyAdvert', () => {
            // настраиваем шпиона isMyAdvert, чтобы при вызове он возвращал Signal<boolean> со значением true
            usersFacade.isMyAdvert.and.returnValue(signal(true));
            // вручную устанавливаем сигнал advert (как если бы он уже загрузился)
            component.advert.set(mockAdvert);
            // проверяем итоговое значение
            expect(component.isMyAdvert()).toBeTrue();
        });

        it('вызывает AuthStateService.isAuth при вызове isAuth()', () => {
            // настраиваем шпиона isAuth, чтобы при вызове он возвращал true
            authStateService.isAuth.and.returnValue(true);
            // проверяем статус авторизации в компоненте
            const result = component.isAuth();

            // проверяем, что isAuth был вызван
            expect(authStateService.isAuth).toHaveBeenCalled();
            // проверяем итоговое значение
            expect(result).toBeTrue();
        });
    });

    describe('# интерактивные методы', () => {
        it('вызывает dialogService.open при infoDialogOpen', () => {
            // вызываем публичный метод компонента с параметрами
            component.infoDialogOpen('Павел', '+79998887766');
            // проверяем, что dialogService.open вызван с ожидаемыми параметрами
            expect(dialogService.open).toHaveBeenCalledWith('info', 'Павел', '+79998887766');
        });
    });

    describe('# удаление объявления', () => {
        it('выполняет удаление объявления через ConfirmService и AdvertService', () => {
            // вручную устанавливаем сигнал advert
            component.advert.set(mockAdvert);
            // имитируем поведение пользователя, подтверждающего удаление
            confirm.confirm.and.callFake((_, cb) => cb());
            // настраиваем шпиона deleteAdvert, чтобы при вызове он возвращал Observable<void> (успешный ответ сервера)
            advertService.deleteAdvert.and.returnValue(of(void 0));
            // запускаем логику удаления в компоненте
            component.deleteAdvert();

            // проверяем, что диалог подтверждения был вызван
            expect(confirm.confirm).toHaveBeenCalled();
            // проверяем, что сервис удаления вызван с правильным id
            expect(advertService.deleteAdvert).toHaveBeenCalledWith(
                '4f3b9849-c8a4-4f34-af2a-f9d70feb60d5',
            );
            // проверяем, что после успешного удаления компонент пытается перенаправить пользователя на страницу 'user/adverts'
            expect(router.navigate).toHaveBeenCalledWith(['user/adverts']);
        });

        it('обрабатывает ошибку при удалении объявления', () => {
            // вручную устанавливаем сигнал advert
            component.advert.set(mockAdvert);
            // имитируем поведение пользователя, подтверждающего удаление
            confirm.confirm.and.callFake((_, cb) => cb());
            // настраиваем шпиона deleteAdvert, чтобы при вызове он возвращал Observable с ошибкой (симуляция ответа с ошибкой)
            advertService.deleteAdvert.and.returnValue(throwError(() => new Error('Ошибка')));
            // запускаем логику удаления в компоненте
            component.deleteAdvert();

            // проверяем, что сервис удаления вызван с правильным id
            expect(advertService.deleteAdvert).toHaveBeenCalledWith(
                '4f3b9849-c8a4-4f34-af2a-f9d70feb60d5',
            );
            // проверяем, что флаг isDeleteLoading сброшен в блоке finalize() даже при ошибке
            expect(component.isDeleteLoading()).toBeFalse();
        });

        it('не вызывает ConfirmService, если advertId отсутствует', () => {
            // вручную устанавливаем отсутствие сигнала advert
            component.advert.set(null);
            // запускаем логику удаления в компоненте
            component.deleteAdvert();
            // проверяем , что не вызывается диалог подтверждения
            expect(confirm.confirm).not.toHaveBeenCalled();
        });
    });
});
