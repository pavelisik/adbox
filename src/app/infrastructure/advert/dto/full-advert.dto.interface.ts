import { ShortCategoryDTO } from "@app/infrastructure/categories/dto";
import { ShortUserDTO } from "@app/infrastructure/users/dto";


export interface FullAdvertDTO {
    category: ShortCategoryDTO;
    cost: number;
    created: string;
    description: string;
    email: string;
    id: string;
    imagesIds: string[];
    isActive: boolean;
    location: string;
    name: string;
    phone: string;
    user: ShortUserDTO;
}
