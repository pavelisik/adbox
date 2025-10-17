import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Comment, EditCommentRequest } from '@app/pages/advert/domains';
import { CommentDTO, EditCommentRequestDTO } from '@app/infrastructure/comment/dto';
import {
    CommentFromDTOAdapter,
    EditCommentRequestToDTOAdapter,
} from '@app/infrastructure/comment/adapters';

@Injectable({
    providedIn: 'root',
})
export class CommentApiService {
    private readonly http = inject(HttpClient);

    getComment(id: string): Observable<Comment> {
        return this.http
            .get<CommentDTO>(`${environment.baseApiURL}/Comment/${id}`)
            .pipe(map((res) => CommentFromDTOAdapter(res)));
    }

    editComment(id: string, params: EditCommentRequest): Observable<Comment> {
        const request: EditCommentRequestDTO = EditCommentRequestToDTOAdapter(params);
        return this.http
            .put<CommentDTO>(`${environment.baseApiURL}/Comment/${id}`, request)
            .pipe(map((res) => CommentFromDTOAdapter(res)));
    }

    deleteComment(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.baseApiURL}/Comment/${id}`);
    }
}
