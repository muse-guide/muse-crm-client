import {Exhibition} from "../model/Exhibition";
import api from "../http/client"
import {Auth} from "aws-amplify";

async function getToken() {
    return `Bearer ${(await Auth.currentSession())
        .getIdToken()
        .getJwtToken()}`
}

async function getExhibition(id: string): Promise<Exhibition> {
    const path = `/exhibitions/${id}`;
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

export const exhibitionService = {
    getExhibition: getExhibition,
};
