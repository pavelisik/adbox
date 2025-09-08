export interface Advert {
    id: string;
    name: string | null;
    location: string;
    createdAt: string;
    isActive: boolean;
    imagesIds: string[] | null;
    cost: number;
}

export interface AdvertFull {
    category: {
        id: string;
        name: string;
        parentId: string;
    };
    cost: number;
    created: string;
    description: string;
    email: string;
    id: string;
    imagesIds: string[];
    isActive: boolean;
    location: string;
    name: string;
    phone: string;
    user: {
        id: string;
        name: string;
    };
}

export interface AdvertSearchRequest {
    search: string;
    showNonActive: boolean;
    category: string;
}
