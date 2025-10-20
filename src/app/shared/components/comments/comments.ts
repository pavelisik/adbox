import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentsFacade } from '@app/shared/services';
import { CommentsList } from './comments-list/comments-list';
import { AuthStateService, UserFacade } from '@app/core/auth/services';
import { transformComments } from '@app/shared/utils';
import { CommentsForm } from './comments-form/comments-form';
import { ConfirmService } from '@app/core/confirmation';
import { NewAdvertCommentRequest } from '@app/pages/advert/domains';
import { DialogService } from '@app/core/dialog';
import { ButtonModule } from 'primeng/button';
import { CommentsSkeleton } from '@app/shared/components/skeletons';

@Component({
    selector: 'app-comments',
    imports: [CommentsList, CommentsForm, ButtonModule, CommentsSkeleton],
    templateUrl: './comments.html',
    styleUrl: './comments.scss',
})
export class Comments {
    private readonly commentsFacade = inject(CommentsFacade);
    private readonly authStateService = inject(AuthStateService);
    private readonly userFacade = inject(UserFacade);
    private readonly dialogService = inject(DialogService);
    private readonly confirm = inject(ConfirmService);
    private readonly route = inject(ActivatedRoute);

    readonly isAuth = this.authStateService.isAuth;
    readonly currentUser = this.userFacade.currentUser;
    readonly isCommentsLoading = this.commentsFacade.isCommentsLoading;
    readonly comments = this.commentsFacade.comments;

    readonly advertId = this.route.snapshot.paramMap.get('id');

    readonly commentsTree = computed(() => {
        const comments = this.comments();
        return comments ? transformComments(comments) : [];
    });

    constructor() {
        if (this.advertId) this.commentsFacade.loadComments(this.advertId);
    }

    onNew(text: string) {
        if (!this.advertId) return;
        this.commentsFacade.addComment(this.advertId, { text });
    }

    onReply(params: NewAdvertCommentRequest) {
        if (!this.advertId) return;
        this.commentsFacade.addComment(this.advertId, params);
    }

    onDelete(commentId: string) {
        this.confirm.confirm('deleteComment', () => {
            if (!this.advertId) return;
            this.commentsFacade.deleteComment(this.advertId, commentId);
        });
    }

    onEdit({ commentId, text }: { commentId: string; text: string }) {
        if (!this.advertId) return;
        this.commentsFacade.editComment(this.advertId, commentId, { text });
    }

    openLoginDialog() {
        this.dialogService.open('login');
    }

    openRegisterDialog() {
        this.dialogService.open('register');
    }
}
