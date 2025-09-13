import { User } from '@app/core/auth/domains';
import { UserDTO } from '@app/infrastructure/users/dto';

export const UserFromDTOAdapter = (data: UserDTO): User => {
    return {
        id: data.id,
        name: data.name,
        role: data.role,
        adverts: data.adverts,
        registeredTime: data.registeredTime,
    };
};
