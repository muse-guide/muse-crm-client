import {Exhibition} from "../model/Exhibition";
import api from "../http/client"

async function getExhibition(id: string): Promise<Exhibition> {
    const path = `/exhibitions/${id}`;
    try {
        const response = await api.get<Exhibition>(path);
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
