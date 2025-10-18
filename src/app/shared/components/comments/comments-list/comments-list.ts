import { Component, input, model, output } from '@angular/core';
import { CommentFull } from '@app/pages/advert/domains';
import { CommentComponent } from './comment/comment';

@Component({
    selector: 'app-comments-list',
    imports: [CommentComponent],
    templateUrl: './comments-list.html',
    styleUrl: './comments-list.scss',
})
export class CommentsList {
    comments = input<CommentFull[]>([]);

    activeId = model<string | null>(null);

    deleteRequest = output<string>();
    replyRequest = output<{ parentId: string; text: string }>();
    editRequest = output<{ id: string; text: string }>();
}
