import { MenuItem } from 'primeng/api';
import { Category } from '@app/pages/advert/domains';

export interface CategoryMenuItem extends MenuItem {
    data: Category;
    isRootItem: boolean;
}
