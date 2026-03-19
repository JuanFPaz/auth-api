// src/utils/errorHandler.ts
export const handleError = (err: unknown, res: any, context?: string) => {
    console.error(`[${context ?? 'Error'}]`, err);
    res.status(500).json({
        msg: 'Internal server error',
        error: (err as Error).message,
    });
};