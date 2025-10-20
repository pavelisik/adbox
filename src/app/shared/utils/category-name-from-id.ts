import catWithAdverts from '@app/shared/data/cat-with-adverts.json';

/**
 * возвращаем имя категории по значению ее id
 */
export function categoryNameFromId(catId: string): string {
    return catWithAdverts.find((cat) => cat.catId === catId)?.catName ?? '';
}
