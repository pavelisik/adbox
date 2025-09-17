import { Component, OnInit, output, signal } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { SvgIcon } from '@app/shared/components';
import { RouterLink } from '@angular/router';
import { Category } from '@app/pages/advert/domains';

@Component({
    selector: 'app-category-menu',
    imports: [ListboxModule, TieredMenuModule, SvgIcon, RouterLink],
    templateUrl: './category-menu.html',
    styleUrl: './category-menu.scss',
})
export class CategoryMenu implements OnInit {
    // событие выбора категории
    categorySelected = output<void>();
    // активная родительская категория
    activeParent = signal<Category | null>(null);

    categories: Category[] = [
        {
            id: 'ec99b930-c589-4935-80bb-a14722a73226',
            name: 'Недвижимость',
            parentId: '00000000-0000-0000-0000-000000000000',
            childs: [
                {
                    id: 'f2de4a69-1f28-4264-8f11-86b6f85d7b77',
                    name: 'Дома',
                    parentId: 'ec99b930-c589-4935-80bb-a14722a73226',
                    childs: [],
                },
                {
                    id: '8ddb6d30-4e37-46ec-8abd-22cc8371a4a9',
                    name: 'Коммерческая недвижимость',
                    parentId: 'ec99b930-c589-4935-80bb-a14722a73226',
                    childs: [],
                },
                {
                    id: 'b52640b4-0be8-459a-a8b1-0c1e6ccfc9dc',
                    name: 'Гаражи и стоянки',
                    parentId: 'ec99b930-c589-4935-80bb-a14722a73226',
                    childs: [],
                },
                {
                    id: '51f6b956-d259-4944-a776-1a6330a51001',
                    name: 'Земельные участки',
                    parentId: 'ec99b930-c589-4935-80bb-a14722a73226',
                    childs: [],
                },
                {
                    id: 'a3f5b764-0714-48b9-ad27-4afe49605bc2',
                    name: 'Квартиры',
                    parentId: 'ec99b930-c589-4935-80bb-a14722a73226',
                    childs: [],
                },
            ],
        },
        {
            id: '93b7fa2a-e4eb-41f8-a98b-454e4fe5d04c',
            name: 'Транспорт',
            parentId: '00000000-0000-0000-0000-000000000000',
            childs: [],
        },
        {
            id: '19dca9ff-4528-4659-b92f-1772613a96ee',
            name: 'Работа',
            parentId: '00000000-0000-0000-0000-000000000000',
            childs: [],
        },
        {
            id: '549a947b-d3be-4aae-9a8a-c4effb59a44d',
            name: 'Услуги',
            parentId: '00000000-0000-0000-0000-000000000000',
            childs: [],
        },
        {
            id: '4cd8b068-3882-4070-a934-45fd06f4c1a4',
            name: 'Электроника',
            parentId: '00000000-0000-0000-0000-000000000000',
            childs: [],
        },
        {
            id: 'cfb1766d-37ac-4c7b-bc76-c18748febd8d',
            name: 'Личные вещи',
            parentId: '00000000-0000-0000-0000-000000000000',
            childs: [],
        },
        {
            id: '0a70f02b-6729-4163-9557-bd27d9c4c5bc',
            name: 'Для дома и дачи',
            parentId: '00000000-0000-0000-0000-000000000000',
            childs: [],
        },
        {
            id: '58c67e3e-62eb-4f4d-b13a-50c1b93cfa18',
            name: 'Автозапчасти и аксессуары',
            parentId: '00000000-0000-0000-0000-000000000000',
            childs: [],
        },
        {
            id: 'c40f82b1-511a-4293-8c71-44bbb2b1e36c',
            name: 'Хобби и отдых',
            parentId: '00000000-0000-0000-0000-000000000000',
            childs: [],
        },
        {
            id: '91771bd9-1f44-422d-aaa3-37d7ddcc782d',
            name: 'Животные',
            parentId: '00000000-0000-0000-0000-000000000000',
            childs: [],
        },
        {
            id: '1641747a-b93b-4564-a64d-ae3c491cce7d',
            name: 'Бизнес и оборудование',
            parentId: '00000000-0000-0000-0000-000000000000',
            childs: [],
        },
    ];

    onHoverParent(item: Category) {
        this.activeParent.set(item);
    }

    onClickCategory() {
        this.categorySelected.emit();
    }

    ngOnInit() {
        // при загрузке сразу выбираем первый родитель
        if (this.categories.length > 0) {
            this.activeParent.set(this.categories[0]);
        }
    }
}
