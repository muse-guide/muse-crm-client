import {CreateExhibition, Exhibition} from "../model/Exhibition";
import api from "../http/client"
import {Auth} from "aws-amplify";
import {AxiosError} from "axios";

async function getToken() {
    return `Bearer ${(await Auth.currentSession())
        .getIdToken()
        .getJwtToken()}`
}

async function getExhibition(id: string): Promise<Exhibition> {
    const path = `/${id}`;
    try {
        const response = await api.get<Exhibition>(path, {
            headers: {
                "Authorization": await getToken()
            }
        });
        console.log(response.data)
        return response.data;
    } catch (err) {
        console.error(`Failed to retrieve exhibit with error: ${err}`);
        throw err;
    }
}

async function createExhibition(data: CreateExhibition): Promise<Exhibition> {
    try {
        const response = await api.post<Exhibition>("/", data, {
            headers: {
                "Authorization": await getToken()
            }
        });
        console.log(response.data)
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.data);
            console.log(err.response?.status);
            console.log(err.response?.headers);
        }
        console.error(`Failed to create exhibit with error: ${err}`);
        throw err;
    }
}

export const exhibitionService = {
    getExhibition: getExhibition,
    createExhibition: createExhibition,
};
