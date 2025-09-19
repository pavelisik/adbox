import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'advertsCount',
})
export class AdvertsCountPipe implements PipeTransform {
    transform(count: number | null | undefined): string {
        if (!count) {
            return 'Не найдено объявлений';
        }

        const mod10 = count % 10;
        const mod100 = count % 100;
        let word = 'объявлений';

        if (mod100 >= 11 && mod100 <= 14) {
            word = 'объявлений';
        } else if (mod10 === 1) {
            word = 'объявление';
        } else if (mod10 >= 2 && mod10 <= 4) {
            word = 'объявления';
        }

        return `Всего найдено ${count} ${word}`;
    }
}
