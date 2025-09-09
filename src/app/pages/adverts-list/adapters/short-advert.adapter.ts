import { ShortAdvert } from '../domains';
import { ShortAdvertDTO } from '@app/infrastructure/advert/dto';

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
