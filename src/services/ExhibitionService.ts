import {CreateExhibition, Exhibition} from "../model/exhibition";
import api, {getAuthHeaders, requestWrapper} from "../http/client"
import {PaginatedResults,} from "../http/types";

const entityPath = `/exhibitions`;

async function getExhibition(id: string): Promise<Exhibition> {
    return await requestWrapper(async () => {
        const path = `${entityPath}/${id}`;
        const response = await api.get<Exhibition>(path, {...await getAuthHeaders()});
        return response.data;
    })
}

async function getExhibitions(searchParams?: {}): Promise<Exhibition[]> {
    return await requestWrapper(async () => {
        const response = await api.get<PaginatedResults>(entityPath, {...await getAuthHeaders()});
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
    createExhibition: createExhibition,
    deleteExhibition: deleteExhibition,
    updateExhibition: updateExhibition,
};
