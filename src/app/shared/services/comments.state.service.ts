import { Injectable, signal } from '@angular/core';
import { Comment } from '@app/pages/advert/domains';

@Injectable({
    providedIn: 'root',
})
export class CommentsStateService {
    private readonly _comments = signal<Comment[]>([]);
    readonly comments = this._comments.asReadonly();

    set(comments: Comment[]) {
        this._comments.set(comments);
    }

    clear() {
        this._comments.set([]);
    }
}
