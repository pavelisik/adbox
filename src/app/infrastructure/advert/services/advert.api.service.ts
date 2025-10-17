import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
    AdvertSearchRequestDTO,
    FullAdvertDTO,
    NewAdvertRequestDTO,
    NewAdvertCommentRequestDTO,
    ShortAdvertDTO,
} from '@app/infrastructure/advert/dto';
import {
    AdvertSearchRequestToDTOAdapter,
    FullAdvertFromDTOAdapter,
    NewAdvertRequestToDTOAdapter,
    NewAdvertCommentRequestToDTOAdapter,
    ShortAdvertFromDTOAdapter,
} from '@app/infrastructure/advert/adapters';
import { FullAdvert, NewAdvertCommentRequest, Comment } from '@app/pages/advert/domains';
import { AdvertSearchRequest, ShortAdvert } from '@app/pages/adverts-list/domains';
import { CommentDTO } from '@app/infrastructure/comment/dto';
import { CommentFromDTOAdapter } from '@app/infrastructure/comment/adapters';
import { NewAdvertRequest } from '@app/pages/advert-add/domains';

@Injectable({
    providedIn: 'root',
})
export class AdvertApiService {
    private readonly http = inject(HttpClient);

    // ОБЪЯВЛЕНИЯ
    getAdvert(id: string): Observable<FullAdvert> {
        return this.http
            .get<FullAdvertDTO>(`${environment.baseApiURL}/Advert/${id}`)
            .pipe(map((res) => FullAdvertFromDTOAdapter(res)));
    }

    searchAdverts(params: AdvertSearchRequest): Observable<ShortAdvert[]> {
        const request: AdvertSearchRequestDTO = AdvertSearchRequestToDTOAdapter(params);
        return this.http
            .post<ShortAdvertDTO[]>(`${environment.baseApiURL}/Advert/search`, request)
            .pipe(map((res) => res.map((item) => ShortAdvertFromDTOAdapter(item))));
    }

    newAdvert(params: NewAdvertRequest): Observable<ShortAdvert> {
        const request: NewAdvertRequestDTO = NewAdvertRequestToDTOAdapter(params);
        const formData = this.buildAdvertFormData(request);
        return this.http
            .post<ShortAdvertDTO>(`${environment.baseApiURL}/Advert`, formData)
            .pipe(map((res) => ShortAdvertFromDTOAdapter(res)));
    }

    updateAdvert(id: string, params: NewAdvertRequest): Observable<ShortAdvert> {
        const request: NewAdvertRequestDTO = NewAdvertRequestToDTOAdapter(params);
        const formData = this.buildAdvertFormData(request);
        return this.http
            .put<ShortAdvertDTO>(`${environment.baseApiURL}/Advert/${id}`, formData)
            .pipe(map((res) => ShortAdvertFromDTOAdapter(res)));
    }

    deleteAdvert(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.baseApiURL}/Advert/${id}`);
    }

    private buildAdvertFormData(request: NewAdvertRequestDTO): FormData {
        const formData = new FormData();
        formData.append('Name', request.title);
        if (request.description) formData.append('Description', request.description);
        request.images?.forEach((image) => formData.append('Images', image));
        if (request.email) formData.append('Email', request.email);
        formData.append('Cost', request.cost.toString());
        formData.append('Phone', request.phone);
        formData.append('Location', request.location);
        formData.append('CategoryId', request.category);
        return formData;
    }

    // КОММЕНТАРИИ
    getAdvertComments(id: string): Observable<Comment[]> {
        return this.http
            .get<CommentDTO[]>(`${environment.baseApiURL}/Advert/${id}/Comments`)
            .pipe(map((res) => res.map((item) => CommentFromDTOAdapter(item))));
    }

    newAdvertComment(id: string, params: NewAdvertCommentRequest): Observable<Comment> {
        const request: NewAdvertCommentRequestDTO = NewAdvertCommentRequestToDTOAdapter(params);
        const formData = this.buildCommentFormData(request);
        return this.http
            .post<CommentDTO>(`${environment.baseApiURL}/Advert/${id}/comments`, formData)
            .pipe(map((res) => CommentFromDTOAdapter(res)));
    }

    private buildCommentFormData(request: NewAdvertCommentRequestDTO): FormData {
        const formData = new FormData();
        formData.append('Text', request.text);
        if (request.parentId) formData.append('ParentId', request.parentId);
        return formData;
    }
}
