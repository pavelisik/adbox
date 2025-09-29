export enum HttpErrorTitle {
    BadRequest = 'Ошибка запроса',
    Unauthorized = 'Ошибка авторизации',
    Forbidden = 'Доступ запрещён',
    NotFound = 'Не найдено',
    Conflict = 'Конфликт данных',
    InternalServerError = 'Серверная ошибка',
    Unknown = 'Неизвестная ошибка',
}

export const getErrorTitle = (status: number): string => {
    switch (status) {
        case 400:
            return HttpErrorTitle.BadRequest;
        case 401:
            return HttpErrorTitle.Unauthorized;
        case 403:
            return HttpErrorTitle.Forbidden;
        case 404:
            return HttpErrorTitle.NotFound;
        case 422:
            return HttpErrorTitle.Conflict;
        case 500:
            return HttpErrorTitle.InternalServerError;
        default:
            return HttpErrorTitle.Unknown;
    }
};
