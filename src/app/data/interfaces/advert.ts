export interface Advert {
    id: string;
    name: string | null;
    location: string | null;
    createdAt: string;
    isActive: boolean;
    imagesIds: string[] | null;
    cost: number;
}

export interface AdvertSearchRequest {
    search: string;
    showNonActive: boolean;
    category: string;
}
