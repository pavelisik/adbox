import { ShortAdvertDTO } from '@app/infrastructure/advert/dto';
import { ShortAdvert } from '@app/pages/adverts-list/domains';

export const ShortAdvertFromDTOAdapter = (data: ShortAdvertDTO): ShortAdvert => {
    return {
        id: data.id,
        name: data.name,
        location: data.location,
        createdAt: data.createdAt,
        isActive: data.isActive,
        imagesIds: data.imagesIds,
        cost: data.cost,
    };
};
