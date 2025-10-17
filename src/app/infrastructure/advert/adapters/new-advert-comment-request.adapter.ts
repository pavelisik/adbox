import { NewAdvertCommentRequestDTO } from '@app/infrastructure/advert/dto';
import { NewAdvertCommentRequest } from '@app/pages/advert/domains';

export const NewAdvertCommentRequestToDTOAdapter = (
    request: NewAdvertCommentRequest,
): NewAdvertCommentRequestDTO => {
    return {
        text: request.text,
        parentId: request.parentId,
    };
};
