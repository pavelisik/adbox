import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { AdvertApiService } from '@app/infrastructure/advert/services';
import { CommentApiService } from '@app/infrastructure/comment/services';
import { NewAdvertCommentRequest, Comment, EditCommentRequest } from '@app/pages/advert/domains';
import { NotificationService } from '@app/core/notification';

@Injectable({
    providedIn: 'root',
})
export class CommentsService {
    private readonly advertApiService = inject(AdvertApiService);
    private readonly commentApiService = inject(CommentApiService);
    private readonly notify = inject(NotificationService);

    getAdvertComments(id: string, limit = 10): Observable<Comment[]> {
        return this.advertApiService.getAdvertComments(id).pipe(map((res) => res.slice(0, limit)));
    }

    newAdvertComment(id: string, params: NewAdvertCommentRequest): Observable<Comment> {
        return this.advertApiService.newAdvertComment(id, params).pipe(
            tap(() => {
                this.notify.success('Добавление комментария', 'Комментарий успешно создан');
            }),
        );
    }

    getComment(id: string): Observable<Comment> {
        return this.commentApiService.getComment(id);
    }

    editComment(id: string, params: EditCommentRequest): Observable<Comment> {
        return this.commentApiService.editComment(id, params).pipe(
            tap(() => {
                this.notify.success(
                    'Редактирование комментария',
                    'Комментарий успешно отредактирован',
                );
            }),
        );
    }

    deleteComment(id: string): Observable<void> {
        return this.commentApiService.deleteComment(id).pipe(
            tap(() => {
                this.notify.success('Удаление комментария', 'Комментарий успешно удален');
            }),
        );
    }
}
