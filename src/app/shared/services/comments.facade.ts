import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommentsService, CommentsStateService } from '@app/shared/services';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommentsFacade {
    private readonly commentsState = inject(CommentsStateService);
    private readonly commentsService = inject(CommentsService);
    private readonly destroyRef = inject(DestroyRef);

    readonly comments = this.commentsState.comments;

    isCommentsLoading = signal<boolean>(false);
    isDeleteLoading = signal<boolean>(false);

    loadComments(advertId: string) {
        this.isCommentsLoading.set(true);
        this.clearState();

        this.commentsService
            .getAdvertComments(advertId)
            .pipe(
                tap((comments) => {
                    this.commentsState.set(comments);
                }),
                catchError((error) => {
                    console.error(error);
                    this.clearState();
                    return of(null);
                }),
                finalize(() => this.isCommentsLoading.set(false)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    private clearState() {
        this.commentsState.clear();
    }
}
