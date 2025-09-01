import { Component, Input } from '@angular/core';
import { AdvertDemo } from '@app/data/interfaces/advert';
import { AdGridItem } from './ad-grid-item/ad-grid-item';

@Component({
    selector: 'app-ad-grid',
    imports: [AdGridItem],
    templateUrl: './ad-grid.html',
    styleUrl: './ad-grid.scss',
})
export class AdGrid {
    @Input() width: 'full' | 'short' = 'full';

    advertsArray: AdvertDemo[] = [
        {
            id: 1,
            title: 'Гитара Fender 01',
            price: 20000,
            address: 'Москва, Ленинский проспект',
            time: 'Сегодня 14:12',
            image: 'assets/images/img01.jpg',
            link: '/',
        },
        {
            id: 2,
            title: 'Гитара Fender 02',
            price: 20000,
            address: 'Москва, Ленинский проспект',
            time: 'Сегодня 14:12',
            image: 'assets/images/img01.jpg',
            link: '/',
        },
        {
            id: 2,
            title: 'Гитара Fender 02',
            price: 20000,
            address: 'Москва, Ленинский проспект',
            time: 'Сегодня 14:12',
            image: 'assets/images/img01.jpg',
            link: '/',
        },
        {
            id: 2,
            title: 'Гитара Fender 02',
            price: 20000,
            address: 'Москва, Ленинский проспект',
            time: 'Сегодня 14:12',
            image: 'assets/images/img01.jpg',
            link: '/',
        },
        {
            id: 2,
            title: 'Гитара Fender 02',
            price: 20000,
            address: 'Москва, Ленинский проспект',
            time: 'Сегодня 14:12',
            image: 'assets/images/img01.jpg',
            link: '/',
        },
        {
            id: 2,
            title: 'Гитара Fender 02',
            price: 20000,
            address: 'Москва, Ленинский проспект',
            time: 'Сегодня 14:12',
            image: 'assets/images/img01.jpg',
            link: '/',
        },
        {
            id: 2,
            title: 'Гитара Fender 02',
            price: 20000,
            address: 'Москва, Ленинский проспект',
            time: 'Сегодня 14:12',
            image: 'assets/images/img01.jpg',
            link: '/',
        },
        {
            id: 2,
            title: 'Гитара Fender 02',
            price: 20000,
            address: 'Москва, Ленинский проспект',
            time: 'Сегодня 14:12',
            image: 'assets/images/img01.jpg',
            link: '/',
        },
        {
            id: 2,
            title: 'Гитара Fender 02',
            price: 20000,
            address: 'Москва, Ленинский проспект',
            time: 'Сегодня 14:12',
            image: 'assets/images/img01.jpg',
            link: '/',
        },
        {
            id: 2,
            title: 'Гитара Fender 02',
            price: 20000,
            address: 'Москва, Ленинский проспект',
            time: 'Сегодня 14:12',
            image: 'assets/images/img01.jpg',
            link: '/',
        },
        {
            id: 2,
            title: 'Гитара Fender 02',
            price: 20000,
            address: 'Москва, Ленинский проспект',
            time: 'Сегодня 14:12',
            image: 'assets/images/img01.jpg',
            link: '/',
        },
        {
            id: 2,
            title: 'Гитара Fender 02',
            price: 20000,
            address: 'Москва, Ленинский проспект',
            time: 'Сегодня 14:12',
            image: 'assets/images/img01.jpg',
            link: '/',
        },
    ];
}
