import { ShortAdvert } from '@app/pages/adverts-list/domains';

/**
 * cортирует объявления по дате создания
 */
export function sortAdvertsByDate(adverts: ShortAdvert[]): ShortAdvert[] {
    return [...adverts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}
