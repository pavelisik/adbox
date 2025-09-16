
import { AdvertSearchRequestDTO } from '@app/infrastructure/advert/dto';
import { AdvertSearchRequest } from '@app/pages/adverts-list/domains';

export const AdvertSearchRequestToDTOAdapter = (
    request: AdvertSearchRequest
): AdvertSearchRequestDTO => {
    return {
        search: request.search,
        category: request.category,
        showNonActive: request.showNonActive,
    };
};
