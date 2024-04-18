import {CreateExhibit, Exhibit} from "../model/exhibit";
import api, {getAuthHeaders, requestWrapper} from "../http/client"
import {PaginatedResults, Pagination,} from "../http/types";
import {ExhibitsFilter} from "../routes/exhibit/ExhibitsPage";

const entityPath = `/exhibits`;

async function getExhibit(id: string): Promise<Exhibit> {
    return await requestWrapper(async () => {
        const path = `${entityPath}/${id}`;
        const response = await api.get<Exhibit>(path, {...await getAuthHeaders()});
        return response.data;
    })
}

export interface SearchParams {
    filters: ExhibitsFilter,
    pagination: Pagination,
}

async function getExhibits(searchParams?: SearchParams): Promise<PaginatedResults> {
    return await requestWrapper(async () => {
        const response = await api.get<PaginatedResults>(entityPath, {
            ...await getAuthHeaders(),
            params: {
                "exhibition-id": normalize(searchParams?.filters.exhibitionId),
                "reference-name-prefix": normalize(searchParams?.filters.referenceNamePrefix),
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

function normalize(value: string | undefined): string | undefined {
    return value === "" ? undefined : value;
}

export const exhibitService = {
    getExhibit: getExhibit,
    getExhibits: getExhibits,
    createExhibit: createExhibit,
    deleteExhibit: deleteExhibit,
    updateExhibit: updateExhibit,
};
