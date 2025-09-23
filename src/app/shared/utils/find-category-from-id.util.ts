import { Category } from '@app/pages/advert/domains';

/**
 * функция для поиска категории по id в модифицированном древовидном массиве
 * если isChilds === false возвращаем обобщенный пункт item когда не нужны родительские и дочерние категории
 */
export function findCategoryFromId(
    categories: Category[],
    id: string,
    isChilds: boolean = true,
): { parent: Category | null; child: Category | null; item: Category | null } | null {
    for (const cat of categories) {
        // найдена категория верхнего уровня
        if (cat.id === id) {
            if (isChilds) {
                return { parent: cat, child: null, item: null };
            } else {
                return { parent: cat, child: null, item: cat };
            }
        }
        if (cat.childs?.length) {
            const foundInChild = cat.childs.find((childCat) => childCat.id === id);
            // найдена дочерняя категория
            if (foundInChild) {
                if (isChilds) {
                    return { parent: cat, child: foundInChild, item: null };
                } else {
                    return { parent: cat, child: foundInChild, item: foundInChild };
                }
            }
        }
    }
    return null;
}
