export interface AdvertDemo {
    id: number;
    title: string;
    price: number;
    address: string;
    time: string;
    image: string;
    link: string;
}

export interface Advert {
    id: string;
    name: string | null;
    location: string | null;
    createdAt: string;
    isActive: boolean;
    imagesIds: string[] | null;
    cost: number;
}
