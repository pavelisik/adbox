import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentsFacade } from '@app/shared/services';
import { CommentsList } from './comments-list/comments-list';

@Component({
    selector: 'app-comments',
    imports: [CommentsList],
    templateUrl: './comments.html',
    styleUrl: './comments.scss',
})
export class Comments {
    private readonly commentsFacade = inject(CommentsFacade);
    private readonly route = inject(ActivatedRoute);

    readonly comments = this.commentsFacade.comments;

    readonly isCommentsLoading = this.commentsFacade.isCommentsLoading;
    readonly isDeleteLoading = this.commentsFacade.isDeleteLoading;

    constructor() {
        const advertId = this.route.snapshot.paramMap.get('id');
        if (advertId) {
            this.commentsFacade.loadComments(advertId);
        }
    }
}
