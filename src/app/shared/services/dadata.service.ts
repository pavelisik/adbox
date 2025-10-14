import { inject, Injectable } from '@angular/core';
import { DadataApiService } from '@app/infrastructure/dadata';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DadataService {
    private readonly api = inject(DadataApiService);

    getAddressStrings(query: string) {
        return this.api
            .suggestAddress(query)
            .pipe(map((res) => res.suggestions.map((suggestion) => suggestion.value)));
    }
}
