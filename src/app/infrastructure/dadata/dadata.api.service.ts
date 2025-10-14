import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { DadataSuggestionResponse } from './domains';

@Injectable({
    providedIn: 'root',
})
export class DadataApiService {
    private readonly http = inject(HttpClient);

    private readonly baseUrl = environment.dadata.suggestionBaseApiURL;
    private readonly token = environment.dadata.token;

    suggestAddress(query: string) {
        return this.http.post<DadataSuggestionResponse>(
            this.baseUrl,
            { query, count: 5 },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Token ${this.token}`,
                },
            },
        );
    }
}
