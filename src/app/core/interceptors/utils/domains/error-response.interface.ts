export interface ErrorResponse {
    title: string;
    status: number;
    errors?: Record<string, string[]>;
}
