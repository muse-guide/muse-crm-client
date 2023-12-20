import {CreateExhibition, Exhibition} from "../model/exhibition";
import api from "../http/client"
import {fetchAuthSession} from 'aws-amplify/auth';
import {AxiosError} from "axios";
import {PaginatedResults} from "../http/types";

async function getAuthHeaders() {
    const session = await fetchAuthSession()
    return {
        "Authorization": `Bearer ${(session)?.tokens?.idToken}`,
        "IdentityId": session.identityId
    }
}

const entityPath = `/exhibitions`;

async function getExhibition(id: string): Promise<Exhibition> {
    const path = `${entityPath}/${id}`;
    try {
        const response = await api.get<Exhibition>(path, {
            headers: {
                ...await getAuthHeaders()
            }
        });
        console.debug(response.data)
        return response.data;
    } catch (err) {
        console.error(`Failed to retrieve exhibition with error: ${(err)}`);
        throw err;
    }
}

async function getExhibitions(searchParams?: {}): Promise<Exhibition[]> {
    try {
        const response = await api.get<PaginatedResults>(entityPath, {
            headers: {
                ...await getAuthHeaders()
            }
        });
        console.debug(response.data.items)
        return response.data.items as Exhibition[];
    } catch (err) {
        console.error(`Failed to retrieve exhibitions with error: ${err}`);
        throw err;
    }
}

async function createExhibition(data: CreateExhibition): Promise<Exhibition> {
    try {
        const response = await api.post<Exhibition>(entityPath, data, {
            headers: {
                ...await getAuthHeaders()
            }
        });
        console.debug(response.data)
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
        }
        console.error(`Failed to create exhibit with error: ${err}`);
        throw err;
    }
}

async function updateExhibition(data: Exhibition): Promise<Exhibition> {
    const path = `${entityPath}/${data.id}`;
    try {
        const response = await api.put<Exhibition>(path, data, {
            headers: {
                ...await getAuthHeaders()
            }
        });
        console.debug(response.data)
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
        }
        console.error(`Failed to update exhibit with error: ${err}`);
        throw err;
    }
}

async function deleteExhibition(id: string) {
    const path = `${entityPath}/${id}`;
    try {
        const response = await api.delete<Exhibition>(path, {
            headers: {
                ...await getAuthHeaders()
            }
        });
        console.debug(response.data)
    } catch (err) {
        if (err instanceof AxiosError) {
        }
        console.error(`Failed to create exhibit with error: ${err}`);
        throw err;
    }
}

export const exhibitionService = {
    getExhibition: getExhibition,
    getExhibitions: getExhibitions,
    createExhibition: createExhibition,
    deleteExhibition: deleteExhibition,
    updateExhibition: updateExhibition,
};
