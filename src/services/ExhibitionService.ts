import {CreateExhibition, Exhibition} from "../model/exhibition";
import api, {getAuthHeaders, normalize, requestWrapper} from "../http/client"
import {PaginatedResults, ApiPagination,} from "../http/types";
import {customerService} from "./CustomerService";
import {configurationService} from "./ConfigurationService";

const entityPath = `/exhibitions`;

async function getExhibition(id: string): Promise<Exhibition> {
    return await requestWrapper(async () => {
        const path = `${entityPath}/${id}`;
        const response = await api.get<Exhibition>(path, {...await getAuthHeaders()});
        return response.data;
    })
}

export interface ExhibitionsFilter {
    referenceNameLike?: string
}

export interface SearchParams {
    filters: ExhibitionsFilter,
    pagination: ApiPagination,
}

async function getExhibitions(searchParams?: SearchParams): Promise<PaginatedResults> {
    return await requestWrapper(async () => {
        const response = await api.get<PaginatedResults>(entityPath, {
            ...await getAuthHeaders(),
            params: {
                "reference-name-like": normalize(searchParams?.filters.referenceNameLike),
                "page-size": searchParams?.pagination.pageSize,
                "next-page-key": searchParams?.pagination.nextPageKey
            }
        });
        return response.data;
    })
}
async function getAllExhibitions(): Promise<Exhibition[]> {
    return await requestWrapper(async () => {
        const response = await api.get<PaginatedResults>(entityPath, {
            ...await getAuthHeaders()
        });
        return response.data.items as Exhibition[];
    })
}

async function createExhibition(data: CreateExhibition): Promise<Exhibition> {
    return await requestWrapper(async () => {
        const response = await api.post<Exhibition>(entityPath, data, {...await getAuthHeaders()});
        return response.data;
    })
}

async function updateExhibition(data: Exhibition): Promise<Exhibition> {
    return await requestWrapper(async () => {
        const path = `${entityPath}/${data.id}`;
        const response = await api.put<Exhibition>(path, data, {...await getAuthHeaders()});
        return response.data;
    })
}

async function deleteExhibition(id: string) {
    return await requestWrapper(async () => {
        const path = `${entityPath}/${id}`;
        const response = await api.delete<Exhibition>(path, {...await getAuthHeaders()});
    })
}

export const exhibitionService = {
    getExhibition: getExhibition,
    getExhibitions: getExhibitions,
    getAllExhibitions: getAllExhibitions,
    createExhibition: createExhibition,
    deleteExhibition: deleteExhibition,
    updateExhibition: updateExhibition,
};
