import { Component, computed, effect, inject } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CategoryFacade } from '@app/shared/services';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CategoryMenuItem } from '@app/pages/adverts-list/domains';
import { Category } from '@app/pages/advert/domains';

import { ButtonModule } from 'primeng/button';

interface advertAddForm {
    category: FormControl<string>;
    title: FormControl<string>;
    description: FormControl<string>;
    address: FormControl<string>;
    price: FormControl<string>;
}

interface CategoryCascadeOption {
    name: string;
    value: string;
    states?: CategoryCascadeOption[];
}

@Component({
    selector: 'app-advert-add',
    imports: [
        ReactiveFormsModule,
        CascadeSelectModule,
        InputTextModule,
        TextareaModule,
        ButtonModule,
    ],
    templateUrl: './advert-add.html',
    styleUrl: './advert-add.scss',
})
export class AdvertAdd {
    private readonly categoryFacade = inject(CategoryFacade);
    private readonly fb = inject(FormBuilder);

    readonly categories = this.categoryFacade.allCategories;

    categoriesStatic: any[] | undefined = [
        {
            name: 'Недвижимость',
            childs: [
                { name: 'Дома' },
                { name: 'Коммерческая недвижимость' },
                { name: 'Гаражи и стоянки' },
                { name: 'Земельные участки' },
                { name: 'Квартиры' },
            ],
        },
        { name: 'Транспорт' },
        { name: 'Работа' },
        { name: 'Услуги' },
        { name: 'Электроника' },
        { name: 'Личные вещи' },
        { name: 'Для дома и дачи' },
        { name: 'Автозапчасти и аксессуары' },
        { name: 'Хобби и отдых' },
        { name: 'Животные' },
        { name: 'Бизнес и оборудование' },
    ];

    advertAddForm: FormGroup<advertAddForm> = this.fb.nonNullable.group({
        category: ['', Validators.required],
        title: ['', Validators.required],
        description: [''],
        address: ['', Validators.required],
        price: [''],
    });

    onSubmit() {
        console.log(this.advertAddForm.getRawValue());
    }

    // categoriesMenuItems = computed<CategoryCascadeOption[]>(() =>
    //     this.buildCascadeOptions(this.categories()),
    // );

    // трансформируем массив со всеми категориями для вывода в меню выбора
    // private buildMenuItems(categories: Category[], isRootItem = true): CategoryMenuItem[] {
    //     return categories.map((cat) => {
    //         const item: CategoryMenuItem = {
    //             label: cat.name,
    //             data: cat,
    //             isRootItem,
    //         };
    //         if (cat.childs) item.items = this.buildMenuItems(cat.childs, false);
    //         return item;
    //     });
    // }

    // private buildCascadeOptions(categories: Category[]): CategoryCascadeOption[] {
    //     return categories.map((cat) => {
    //         const option: any = {
    //             name: cat.name,
    //             value: cat, // можно сохранить сам объект, чтобы потом знать id
    //         };

    //         if (cat.childs?.length) {
    //             option.states = this.buildCascadeOptions(cat.childs);
    //         }

    //         return option;
    //     });
    // }

    constructor() {
        effect(() => {
            const categories = this.categories();
            console.log(categories);
        });
    }
}
