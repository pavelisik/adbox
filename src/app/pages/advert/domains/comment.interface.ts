import { ShortUser } from '@app/core/auth/domains';
import { ShortAdvert } from '@app/pages/adverts-list/domains';

export interface Comment {
    id: string;
    text: string;
    created: string;
    parentId: string;
    advert?: ShortAdvert;
    user: ShortUser;
}
