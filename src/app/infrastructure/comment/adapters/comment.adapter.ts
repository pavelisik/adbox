import { Comment } from '@app/pages/advert/domains';
import { CommentDTO } from '@app/infrastructure/comment/dto';

export const CommentFromDTOAdapter = (data: CommentDTO): Comment => {
    return {
        id: data.id,
        text: data.text,
        created: data.created,
        parentId: data.parentId,
        advert: data.advert,
        user: data.user,
    };
};
