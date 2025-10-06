export interface NewAdvertRequest {
    title: string;
    description?: string;
    images?: string;
    cost: number;
    email?: string;
    phone: string;
    location: string;
    category: string;
}
