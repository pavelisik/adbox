import { Category } from '../domains';
import { CategoryDTO } from '@app/infrastructure/categories/dto';

export const CategoryFromDTOAdapter = (data: CategoryDTO): Category => {
    return {
        id: data.id,
        name: data.name,
        parentId: data.parentId,
        childs: data.childs,
    };
};
