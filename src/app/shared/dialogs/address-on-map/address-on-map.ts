import { Component, inject } from '@angular/core';
import { AdvertFacade } from '@app/shared/services';

declare const ymaps: any;

@Component({
    selector: 'app-address-on-map',
    imports: [],
    templateUrl: './address-on-map.html',
    styleUrl: './address-on-map.scss',
})
export class AddressOnMap {
    advertFacade = inject(AdvertFacade);

    advert = this.advertFacade.advert;

    private mapContainerId = 'map';
    private map: any;
    private placemark: any;

    constructor() {
        const address = this.advert()?.location;
        if (address) {
            this.loadMap(address);
        }
    }

    private loadMap(address: string) {
        if (!ymaps) {
            console.error('Yandex Maps API не загружен');
            return;
        }

        ymaps.ready(() => {
            ymaps
                .geocode(address)
                .then((res: any) => {
                    const firstGeoObject = res.geoObjects.get(0);
                    if (!firstGeoObject) {
                        console.error('Адрес не найден');
                        return;
                    }

                    const coords = firstGeoObject.geometry.getCoordinates();

                    if (!this.map) {
                        this.map = new ymaps.Map(this.mapContainerId, { center: coords, zoom: 16 });
                    } else {
                        this.map.setCenter(coords);
                    }

                    if (!this.placemark) {
                        this.placemark = new ymaps.Placemark(coords, { balloonContent: address });
                        this.map.geoObjects.add(this.placemark);
                    } else {
                        this.placemark.geometry.setCoordinates(coords);
                        this.placemark.properties.set('balloonContent', address);
                    }

                    this.placemark.balloon.open();
                })
                .catch((err: any) => console.error('Ошибка геокодирования:', err));
        });
    }
}
