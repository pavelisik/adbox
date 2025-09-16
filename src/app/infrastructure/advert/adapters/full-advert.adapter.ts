import { FullAdvert } from '@app/pages/advert/domains';
import { FullAdvertDTO } from '@app/infrastructure/advert/dto';

export const FullAdvertFromDTOAdapter = (data: FullAdvertDTO): FullAdvert => {
    return {
        category: data.category,
        cost: data.cost,
        created: data.created,
        description: data.description,
        email: data.email,
        id: data.id,
        imagesIds: data.imagesIds,
        isActive: data.isActive,
        location: data.location,
        name: data.name,
        phone: data.phone,
        user: data.user,
    };
};
