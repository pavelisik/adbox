import { Component, inject, input, model, output, signal } from '@angular/core';
import { AuthStateService, UsersFacade } from '@app/core/auth/services';
import { CommentFull } from '@app/pages/advert/domains';
import { DateFormatPipe } from '@app/shared/pipes';
import { CommentsForm } from '../../comments-form/comments-form';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-comment',
    imports: [DateFormatPipe, CommentsForm, ButtonModule],
    templateUrl: './comment.html',
    styleUrl: './comment.scss',
})
export class CommentComponent {
    private readonly authStateService = inject(AuthStateService);
    private readonly usersFacade = inject(UsersFacade);

    activeId = model<string | null>(null);

    comment = input<CommentFull>();
    depthForChild = input<number>(0);
    deleteRequest = output<string>();
    replyRequest = output<{ parentId: string; text: string }>();
    editRequest = output<{ id: string; text: string }>();

    openFormType = signal<'reply' | 'edit' | null>(null);

    readonly isAuth = this.authStateService.isAuth;
    readonly currentUser = this.usersFacade.currentUser;

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
        this.openFormType.set(null);
    }

    get isMyComment() {
        return this.comment()?.user.id === this.currentUser()?.id;
    }

    onDelete() {
        this.deleteRequest.emit(this.comment()?.id ?? '');
    }

    onSubmitReply(text: string) {
        this.replyRequest.emit({ parentId: this.comment()?.id ?? '', text });
        this.onFormClose();
    }

    onSubmitEdit(text: string) {
        this.editRequest.emit({ id: this.comment()?.id ?? '', text });
        this.onFormClose();
    }
}
