export interface NewAdvertRequest {
    title: string;
    description?: string;
    images?: File[];
    cost: number;
    email?: string;
    phone: string;
    location: string;
    category: string;
}
