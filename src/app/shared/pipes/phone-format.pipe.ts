import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phoneFormat',
})
export class PhoneFormatPipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return '';

        // убираем все пробелы и дефисы
        let cleaned = value.replace(/[\s-]/g, '');

        // проверка на корректный код страны
        if (!(cleaned.startsWith('+7') || cleaned.startsWith('8'))) {
            return value;
        }

        const digits = cleaned.replace(/\D/g, '');
        if (digits.length < 11) return value;

        const countryOrLocalCode = cleaned.startsWith('+7') ? '+7' : '8';
        const operatorCode = digits.slice(1, 4);
        const part1 = digits.slice(4, 7);
        const part2 = digits.slice(7, 9);
        const part3 = digits.slice(9);

        return `${countryOrLocalCode} (${operatorCode}) ${part1}-${part2}-${part3}`;
    }
}
