import { ShortUser } from "@app/core/auth/domains";
import { ShortCategory } from "@app/pages/advert/domains";

export interface FullAdvert {
    category: ShortCategory;
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
    user: ShortUser;
}
