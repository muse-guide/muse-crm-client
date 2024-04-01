import {CreateExhibit, Exhibit} from "../model/exhibit";
import api, {getAuthHeaders, requestWrapper} from "../http/client"
import {PaginatedResults,} from "../http/types";

const entityPath = `/exhibits`;

async function getExhibit(id: string): Promise<Exhibit> {
    return await requestWrapper(async () => {
        const path = `${entityPath}/${id}`;
        const response = await api.get<Exhibit>(path, {...await getAuthHeaders()});
        return response.data;
    })
}

async function getExhibits(searchParams?: {}): Promise<Exhibit[]> {
    return await requestWrapper(async () => {
        const response = await api.get<PaginatedResults>(entityPath, {...await getAuthHeaders()});
        return response.data.items as Exhibit[];
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
