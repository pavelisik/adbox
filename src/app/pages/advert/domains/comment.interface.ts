import { ShortUser } from '@app/core/auth/domains';
import { ShortAdvert } from '@app/pages/adverts-list/domains';

export interface CommentFull extends Comment {
    child: CommentFull[];
}

export interface Comment {
    id: string;
    text: string;
    created: string;
    parentId: string;
    advert?: ShortAdvert;
    user: ShortUser;
}
