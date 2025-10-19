import { Component, input, output, signal } from '@angular/core';
import { CommentFull, NewAdvertCommentRequest } from '@app/pages/advert/domains';
import { CommentComponent } from './comment/comment';

@Component({
    selector: 'app-comments-list',
    imports: [CommentComponent],
    templateUrl: './comments-list.html',
    styleUrl: './comments-list.scss',
})
export class CommentsList {
    comments = input<CommentFull[]>([]);
    activeId = signal<string | null>(null);
    deleteRequest = output<string>();
    replyRequest = output<NewAdvertCommentRequest>();
    editRequest = output<{ commentId: string; text: string }>();
}
