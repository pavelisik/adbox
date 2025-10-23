import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
    private timeFormat = new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });

    private dateFormat = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
    });

    transform(value: string | Date): string {
        const date = new Date(value);
        const now = new Date();

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
        };

        const time = this.timeFormat.format(date);

        if (date >= today) {
            return `Сегодня ${time}`;
        }
        if (date >= yesterday) {
            return `Вчера ${time}`;
        }

        return `${this.dateFormat.format(date)} ${time}`;
    }
}
