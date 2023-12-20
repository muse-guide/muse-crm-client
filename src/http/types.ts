export interface PaginatedResults {
    items: { [key: string]: any; }[],
    count: number,
    nextPageKey?: string | undefined
}