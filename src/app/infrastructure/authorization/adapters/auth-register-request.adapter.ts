import { AuthRegisterRequest } from '@app/core/auth/domains';
import { AuthRegisterRequestDTO } from '@app/infrastructure/authorization/dto';

export const AuthRegisterRequestToDTOAdapter = (
    request: AuthRegisterRequest
): AuthRegisterRequestDTO => {
    return {
        name: request.name,
        login: request.login,
        password: request.password,
    };
};
