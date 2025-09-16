import { CategoryDTO } from '@app/infrastructure/categories/dto';
import { Category } from '@app/pages/advert/domains';

export const CategoryFromDTOAdapter = (data: CategoryDTO): Category => {
    return {
        id: data.id,
        name: data.name,
        parentId: data.parentId,
        childs: data.childs,
    };
};
