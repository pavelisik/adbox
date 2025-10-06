import { NewAdvertRequestDTO } from '@app/infrastructure/advert/dto';
import { NewAdvertRequest } from '@app/pages/adverts-list/domains';

export const NewAdvertRequestToDTOAdapter = (request: NewAdvertRequest): NewAdvertRequestDTO => {
    return {
        title: request.title,
        description: request.description,
        images: request.images,
        cost: request.cost,
        email: request.email,
        phone: request.phone,
        location: request.location,
        category: request.category,
    };
};
