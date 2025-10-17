import { Component, input } from '@angular/core';
import { Comment } from '@app/pages/advert/domains';
import { DateFormatPipe } from '@app/shared/pipes';

@Component({
    selector: 'app-comment',
    imports: [DateFormatPipe],
    templateUrl: './comment.html',
    styleUrl: './comment.scss',
})
export class CommentComponent {
    comment = input<Comment | null>(null);
}
