import { UserUpdateRequest } from '@app/core/auth/domains';
import { UserUpdateRequestDTO } from '@app/infrastructure/users/dto';

export const UserUpdateRequestToDTOAdapter = (request: UserUpdateRequest): UserUpdateRequestDTO => {
    return {
        name: request.name,
        login: request.login,
        password: request.password,
    };
};
