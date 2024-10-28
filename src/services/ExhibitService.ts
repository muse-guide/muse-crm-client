import {CreateExhibit, Exhibit} from "../model/exhibit";
import api, {getAuthHeaders, normalize, requestWrapper} from "../http/client"
import {ApiPagination, PaginatedResults,} from "../http/types";

const entityPath = `/exhibits`;

async function getExhibit(id: string): Promise<Exhibit> {
    return await requestWrapper(async () => {
        const path = `${entityPath}/${id}`;
        const response = await api.get<Exhibit>(path, {...await getAuthHeaders()});
        return response.data;
    })
}

export interface ExhibitsFilter {
    exhibitionId: string,
    referenceNameLike?: string
}

export interface SearchParams {
    filters: ExhibitsFilter,
    pagination: ApiPagination,
}

async function getExhibits(searchParams?: SearchParams): Promise<PaginatedResults> {
    return await requestWrapper(async () => {
        const response = await api.get<PaginatedResults>(entityPath, {
            ...await getAuthHeaders(),
            params: {
                "exhibition-id": normalize(searchParams?.filters.exhibitionId),
                "reference-name-like": normalize(searchParams?.filters.referenceNameLike),
                "page-size": searchParams?.pagination.pageSize,
                "next-page-key": searchParams?.pagination.nextPageKey
            }
        });
        return response.data;
    })
}

async function createExhibit(data: CreateExhibit): Promise<Exhibit> {
    return await requestWrapper(async () => {
        const response = await api.post<Exhibit>(entityPath, data, {...await getAuthHeaders()});
        return response.data;
    })
}


async function updateExhibit(data: Exhibit): Promise<Exhibit> {
    return await requestWrapper(async () => {
        const path = `${entityPath}/${data.id}`;
        const response = await api.put<Exhibit>(path, data, {...await getAuthHeaders()});
        return response.data;
    })
}

async function deleteExhibit(id: string) {
    return await requestWrapper(async () => {
        const path = `${entityPath}/${id}`;
        const response = await api.delete<Exhibit>(path, {...await getAuthHeaders()});
    })
}

export const exhibitService = {
    getExhibit: getExhibit,
    getExhibits: getExhibits,
    createExhibit: createExhibit,
    deleteExhibit: deleteExhibit,
    updateExhibit: updateExhibit,
};
