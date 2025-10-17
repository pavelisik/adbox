import { ShortAdvertDTO } from '@app/infrastructure/advert/dto';
import { ShortUserDTO } from '@app/infrastructure/users/dto';

export interface CommentDTO {
    id: string;
    text: string;
    created: string;
    parentId: string;
    advert?: ShortAdvertDTO;
    user: ShortUserDTO;
}
