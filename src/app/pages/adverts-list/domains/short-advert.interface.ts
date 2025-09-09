export interface ShortAdvert {
    id: string;
    name: string;
    location?: string;
    createdAt: string;
    isActive: boolean;
    imagesIds: string[];
    cost: number;
}
