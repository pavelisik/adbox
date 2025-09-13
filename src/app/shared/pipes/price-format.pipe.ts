import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'priceFormat',
})
export class PriceFormatPipe implements PipeTransform {
    transform(value: number | null | undefined): string {
        if (value == null) return '';
        const formatted = new Intl.NumberFormat('ru-RU').format(Math.trunc(value));
        return `${formatted} ₽`;
    }
}
