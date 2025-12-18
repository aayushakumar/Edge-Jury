// Generate a unique ID using crypto.randomUUID
export function generateId(): string {
    return crypto.randomUUID();
}

// Generate a shorter ID for display purposes
export function shortId(): string {
    return crypto.randomUUID().split('-')[0];
}
