import { ShortUser } from '@app/core/auth/domains';
import { ShortUserDTO } from '@app/infrastructure/users/dto';

export const ShortUserFromDTOAdapter = (data: ShortUserDTO): ShortUser => {
    return {
        id: data.id,
        name: data.name,
        login: data.login,
    };
};
