import { ShortAdvertDTO } from '@app/infrastructure/advert/dto';

export interface UserDTO {
    id: string;
    name: string;
    role: string;
    adverts: ShortAdvertDTO[];
    registeredTime: string;
}
