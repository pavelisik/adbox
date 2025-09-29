interface ErrorResponse {
    title: string;
    status: number;
    errors?: Record<string, string[]>;
}

export const formatErrorResponse = (error: ErrorResponse): string => {
    let errorMessage = '';

    if (error.title) {
        errorMessage += error.title + '\n\n';
    }

    if (error.errors && typeof error.errors === 'object') {
        for (const [field, errorMessages] of Object.entries(error.errors)) {
            if (Array.isArray(errorMessages)) {
                errorMessage += `${field.toUpperCase()}: ${errorMessages.join(', ')}\n\n`;
            }
        }
    }

    return errorMessage.trim();
};
