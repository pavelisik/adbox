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
