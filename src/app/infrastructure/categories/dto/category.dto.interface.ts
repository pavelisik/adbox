export interface CategoryDTO {
    id: string;
    name: string;
    parentId: string;
    childs: CategoryDTO[];
}
