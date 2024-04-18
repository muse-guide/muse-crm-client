import {CustomError} from "ts-custom-error";

export interface PaginatedResults {
    items: { [key: string]: any; }[],
    count: number,
    nextPageKey?: string | undefined
}

export interface Pagination {
    pageSize: number,
    nextPageKey?: string
}

export class ApiException extends CustomError {
    statusCode: string;
    message: string;

    constructor(statusCode: string, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

export type MutationError = {
    error: string,
    cause: string
}

export function isMutationError(error: any): error is MutationError {
    return (error as MutationError).error !== undefined
        && (error as MutationError).cause !== undefined;
}