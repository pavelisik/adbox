import { Category } from '@app/pages/advert/domains';

/**
 * функция для поиска категории по id в модифицированном древовидном массиве
 */
export function findCategoryFromId(
    categories: Category[],
    id: string,
): { parent: Category | null; child: Category | null } | null {
    for (const cat of categories) {
        // найдена категория верхнего уровня
        if (cat.id === id) {
            return { parent: cat, child: null };
        }
        if (cat.childs?.length) {
            const foundInChild = cat.childs.find((childCat) => childCat.id === id);
            // найдена дочерняя категория
            if (foundInChild) {
                return { parent: cat, child: foundInChild };
            }
        }
    }
    return null;
}
