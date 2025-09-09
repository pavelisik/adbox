import { AdvertSearchRequest } from '../domains';
import { AdvertSearchRequestDTO } from '@app/infrastructure/adverts/dto';

export const AdvertSearchRequestToDTOAdapter = (
    request: AdvertSearchRequest
): AdvertSearchRequestDTO => {
    return {
        search: request.search,
        category: request.category,
        showNonActive: request.showNonActive,
    };
};
