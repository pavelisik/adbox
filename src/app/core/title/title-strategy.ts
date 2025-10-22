import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AppTitleStrategy extends TitleStrategy {
    private readonly title = inject(Title);

    private readonly defaultTitle = 'ADBOX - Доска объявлений';
    private readonly prefix = 'ADBOX';

    override updateTitle(snapshot: RouterStateSnapshot) {
        const titleFromRoute = this.buildTitle(snapshot);

        if (titleFromRoute) {
            this.title.setTitle(`${this.prefix} - ${titleFromRoute}`);
        } else {
            this.title.setTitle(`${this.defaultTitle}`);
        }
    }
}
