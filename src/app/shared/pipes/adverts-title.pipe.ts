import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'advertsTitle',
})
export class AdvertsTitlePipe implements PipeTransform {
    transform(searchQuery?: string, categoryQuery?: string): string {
        const hasSearch = !!searchQuery?.trim();
        const hasCategory = !!categoryQuery?.trim();

        if (hasSearch && hasCategory) {
            return `Объявления по запросу «${searchQuery}» из категории «${categoryQuery}»`;
        } else if (hasSearch) {
            return `Объявления по запросу «${searchQuery}»`;
        } else if (hasCategory) {
            return `Объявления из категории «${categoryQuery}»`;
        } else {
            return 'Все объявления';
        }
    }
}
