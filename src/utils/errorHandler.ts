// src/utils/errorHandler.ts
export const handleError = (err: unknown, res: any, context?: string) => { 
    console.error(`[${context ?? 'Error'}]`, err);
    res.status(505).json({
        status: 505,
        message: 'Internal server error',
        error: (err as Error).message,
    });
};