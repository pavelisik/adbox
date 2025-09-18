import { Category } from '@app/pages/advert/domains';

/**
 * преобразует массив категорий в дерево с вложенными childs
 */
export function transformCategories(categories: Category[] | null | undefined): Category[] {
    if (!categories) return [];

    // копируем все категории в Map и добавляем поле childs
    const map = new Map<string, Category & { childs?: Category[] }>();
    categories.forEach((cat) => {
        map.set(cat.id, { ...cat, childs: [] });
    });

    const roots: Category[] = [];

    // расставляем дочерние категории по parentId
    map.forEach((cat) => {
        if (cat.parentId && cat.parentId !== '00000000-0000-0000-0000-000000000000') {
            const parent = map.get(cat.parentId);
            if (parent) {
                parent.childs!.push(cat);
            }
        } else {
            roots.push(cat);
        }
    });

    return roots;
}
