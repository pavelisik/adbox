import { AuthLoginRequest } from '@app/core/auth/domains';
import { AuthLoginRequestDTO } from '@app/infrastructure/authorization/dto';

export const AuthLoginRequestToDTOAdapter = (request: AuthLoginRequest): AuthLoginRequestDTO => {
    return {
        login: request.login,
        password: request.password,
    };
};
