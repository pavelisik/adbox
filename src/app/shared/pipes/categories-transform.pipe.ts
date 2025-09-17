import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '@app/pages/advert/domains';

@Pipe({
    name: 'categoriesTransform',
})
export class CategoriesTransformPipe implements PipeTransform {
    transform(categories: Category[] | null | undefined): Category[] {
        if (!categories) return [];
        return this.buildTree(categories);
    }

    private buildTree(categories: Category[]): Category[] {
        const map = new Map<string, Category & { childs?: Category[] }>();
        // копируем все категории в Map
        categories.forEach((cat) => {
            map.set(cat.id, { ...cat, childs: [] });
        });

        const roots: Category[] = [];

        // расставляем дочерние категории по местам
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
}
