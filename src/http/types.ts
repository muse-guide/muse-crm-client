import {CustomError} from "ts-custom-error";

export interface PaginatedResults {
    items: { [key: string]: any; }[],
    count: number,
    nextPageKey?: string | undefined
}

export interface ApiPagination {
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