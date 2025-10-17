import { Component, input } from '@angular/core';
import { Comment } from '@app/pages/advert/domains';
import { CommentComponent } from './comment/comment';

@Component({
    selector: 'app-comments-list',
    imports: [CommentComponent],
    templateUrl: './comments-list.html',
    styleUrl: './comments-list.scss',
})
export class CommentsList {
    comments = input<Comment[]>([]);
}
