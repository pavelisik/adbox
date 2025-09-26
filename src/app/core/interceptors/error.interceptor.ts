import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '@app/core/notification';
import { catchError, throwError } from 'rxjs';
import { ERROR_MESSAGES, getErrorTitle } from '@app/core/constants';
import { formatErrorResponse } from '@app/core/utils';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const notify = inject(NotificationService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const errorTitle = getErrorTitle(error.status);
            let errorMessage = error.message ?? 'Произошла неизвестная ошибка';

            // ищем подходящий эндпоинт в словаре ошибок
            const foundEndpoint = Object.entries(ERROR_MESSAGES).find(([endpoint]) =>
                req.url.includes(endpoint),
            );

            // ищем соответствующее эндпоинту, методу запроса и статусу сообщение в словаре ошибок
            if (foundEndpoint) {
                const [endpoint, requestMethodMap] = foundEndpoint;
                const statusMap = requestMethodMap[req.method as keyof typeof requestMethodMap];
                if (statusMap && statusMap[error.status]) {
                    errorMessage = statusMap[error.status];
                }
            }

            // добавляем подробности из ответа сервера
            if (error.error) {
                const errorResponse = formatErrorResponse(error.error);
                if (errorResponse) {
                    errorMessage += '\n\n' + errorResponse;
                }
            }

            notify.error(errorTitle, errorMessage);
            console.error('HTTP Error:', error);

            return throwError(() => error);
        }),
    );
};
