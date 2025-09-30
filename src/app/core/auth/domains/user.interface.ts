import { ShortAdvert } from '@app/pages/adverts-list/domains';

export interface User {
    id: string;
    name: string;
    role: string;
    login: string;
    adverts: ShortAdvert[];
    registeredTime: string;
}
