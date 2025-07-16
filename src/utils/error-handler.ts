export class AppError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'AppError';
    }
}

export const handleError = (error: Error, userMessage: string = 'An error occurred'): void => {
    console.error('Error:', error);
    
    if (error instanceof AppError) {
        alert(`${userMessage}: ${error.message}`);
    } else {
        alert(userMessage);
    }
};

export const withErrorHandling = <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    errorMessage?: string
) => {
    return async (...args: T): Promise<R | void> => {
        try {
            return await fn(...args);
        } catch (error) {
            handleError(error as Error, errorMessage);
        }
    };
};