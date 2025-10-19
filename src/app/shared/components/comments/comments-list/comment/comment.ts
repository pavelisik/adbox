import { Component, inject, input, model, output, signal } from '@angular/core';
import { AuthStateService, UserFacade } from '@app/core/auth/services';
import { CommentFull, NewAdvertCommentRequest } from '@app/pages/advert/domains';
import { DateFormatPipe } from '@app/shared/pipes';
import { CommentsForm } from '../../comments-form/comments-form';
import { ButtonModule } from 'primeng/button';
import { SvgIcon } from '@app/shared/components';
import { LowerCasePipe } from '@angular/common';

@Component({
    selector: 'app-comment',
    imports: [DateFormatPipe, CommentsForm, ButtonModule, SvgIcon, LowerCasePipe],
    templateUrl: './comment.html',
    styleUrl: './comment.scss',
})
export class CommentComponent {
    private readonly authStateService = inject(AuthStateService);
    private readonly userFacade = inject(UserFacade);

    activeId = model<string | null>(null);

    comment = input<CommentFull>();
    depthForChildren = input<number>(0);
    deleteRequest = output<string>();
    replyRequest = output<NewAdvertCommentRequest>();
    editRequest = output<{ commentId: string; text: string }>();

    openFormType = signal<'reply' | 'edit' | null>(null);

    readonly isAuth = this.authStateService.isAuth;
    readonly currentUser = this.userFacade.currentUser;

    onReplyFormShow() {
        this.activeId.set(this.comment()?.id ?? null);
        this.openFormType.set('reply');
    }

    onEditFormShow() {
        this.activeId.set(this.comment()?.id ?? null);
        this.openFormType.set('edit');
    }

    onFormClose() {
        this.activeId.set(null);
    }

    get isMyComment() {
        return this.comment()?.user.id === this.currentUser()?.id;
    }

    onDelete() {
        this.deleteRequest.emit(this.comment()?.id ?? '');
    }

    onSubmitReply(text: string) {
        this.replyRequest.emit({ text, parentId: this.comment()?.id ?? '' });
        this.onFormClose();
    }

    onSubmitEdit(text: string) {
        this.editRequest.emit({ commentId: this.comment()?.id ?? '', text });
        this.onFormClose();
    }
}
