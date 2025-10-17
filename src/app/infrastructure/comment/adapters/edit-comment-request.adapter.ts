import { EditCommentRequestDTO } from '@app/infrastructure/comment/dto';
import { EditCommentRequest } from '@app/pages/advert/domains';

export const EditCommentRequestToDTOAdapter = (
    request: EditCommentRequest,
): EditCommentRequestDTO => {
    return {
        text: request.text,
    };
};
