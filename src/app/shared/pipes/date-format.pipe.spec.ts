import { DateFormatPipe } from './date-format.pipe';

describe('DateFormat Pipe - пайп для форматирования даты и времени размещения объявления', () => {
    let pipe: DateFormatPipe;

    beforeEach(() => {
        // создаем новый экземпляр пайпа, чтобы каждый тест работал с чистым объектом
        pipe = new DateFormatPipe();
    });

    describe('# общие тесты', () => {
        it('пайп должен создаваться', () => {
            expect(pipe).toBeTruthy();
        });

        it('корректно парсит строковое значение даты', () => {
            const dateString = new Date().toISOString();
            const result = pipe.transform(dateString);
            expect(result).toContain('Сегодня');
        });
    });

    describe('# форматирование даты для разных случаев', () => {
        it('для сегодняшней даты - возвращает "Сегодня HH:MM"', () => {
            const now = new Date();
            const result = pipe.transform(now);

            const time = new Intl.DateTimeFormat('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
            }).format(now);

            expect(result).toBe(`Сегодня ${time}`);
        });

        it('для вчерашней даты - возвращает "Вчера HH:MM"', () => {
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);

            const result = pipe.transform(yesterday);
            const time = new Intl.DateTimeFormat('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
            }).format(yesterday);

            expect(result).toBe(`Вчера ${time}`);
        });

        it('для старых дат - возвращает дату в полном формате (день, месяц, время)', () => {
            // 15 января 2020, 10:30
            const oldDate = new Date(2020, 0, 15, 10, 30);
            const result = pipe.transform(oldDate);

            const expected = new Intl.DateTimeFormat('ru-RU', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
            }).format(oldDate);

            expect(result).toBe(expected);
        });

        it('пограничные случаи между "вчера" и "сегодня" - корректно различает вчерашнюю 23:59 и сегодняшнюю 00:01', () => {
            const now = new Date();
            const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            // 23:59 вчера
            const almostYesterday = new Date(todayMidnight);
            almostYesterday.setMinutes(-1);
            const resultYesterday = pipe.transform(almostYesterday);

            // 00:01 сегодня
            const justToday = new Date(todayMidnight);
            justToday.setMinutes(1);
            const resultToday = pipe.transform(justToday);

            expect(resultYesterday).toContain('Вчера');
            expect(resultToday).toContain('Сегодня');
        });
    });
});
