import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentsFacade, CommentsService } from '@app/shared/services';
import { CommentsList } from './comments-list/comments-list';
import { AuthStateService, UsersFacade } from '@app/core/auth/services';
import { CommentFull } from '@app/pages/advert/domains';
import { transformComments } from '@app/shared/utils';
import { CommentsForm } from './comments-form/comments-form';

@Component({
    selector: 'app-comments',
    imports: [CommentsList, CommentsForm],
    templateUrl: './comments.html',
    styleUrl: './comments.scss',
})
export class Comments {
    private readonly commentsFacade = inject(CommentsFacade);
    private readonly commentsService = inject(CommentsService);
    private readonly authStateService = inject(AuthStateService);
    private readonly usersFacade = inject(UsersFacade);
    private readonly route = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);

    readonly isCommentsLoading = this.commentsFacade.isCommentsLoading;
    readonly isDeleteLoading = this.commentsFacade.isDeleteLoading;

    readonly comments = this.commentsFacade.comments;
    commentsTree = signal<CommentFull[]>([]);

    readonly isAuth = this.authStateService.isAuth;
    readonly currentUser = this.usersFacade.currentUser;

    advertId: string | null = this.route.snapshot.paramMap.get('id');

    // потом разобраться можно ли сбрасывать после запросов для спиннера на кнопке и закрытия форм ввода
    activeId = signal<string | null>(null);

    constructor() {
        if (this.advertId) this.commentsFacade.loadComments(this.advertId);

        effect(() => {
            const comments = this.comments();
            if (comments) this.commentsTree.set(transformComments(comments));
        });
    }

    onNew(text: string) {
        if (!this.advertId) return;
        this.commentsFacade.addComment(this.advertId, { text });
    }

    onReply({ parentId, text }: { parentId: string; text: string }) {
        if (!this.advertId) return;
        this.commentsFacade.addComment(this.advertId, { text, parentId });
    }

    // ОСТАНОВИЛСЯ ВОТ ТУТ!!!!!!!
    onDelete(id: string) {
        if (!this.advertId) return;
        // this.commentsService
        //     .deleteComment(id)
        //     .pipe(takeUntilDestroyed(this.destroyRef))
        //     .subscribe(() => {
        //         this.commentsFacade.loadComments(this.advertId!);
        //     });
    }

    onEdit(e: { id: string; text: string }) {
        // this.commentsService
        //     .editComment(e.id, { text: e.text })
        //     .pipe(takeUntilDestroyed(this.destroyRef))
        //     .subscribe(() => {
        //         if (this.advertId) this.commentsFacade.loadComments(this.advertId);
        //     });
    }
}
