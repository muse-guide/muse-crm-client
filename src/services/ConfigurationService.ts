import api, {getAuthHeaders, normalize, requestWrapper} from "../http/client"
import {ApplicationConfiguration} from "../model/configuration";

const entityPath = `/configuration`;

async function getApplicationConfiguration(): Promise<ApplicationConfiguration> {
    return await requestWrapper(async () => {
        const path = `${entityPath}`;
        const response = await api.get<ApplicationConfiguration>(path, {...await getAuthHeaders()});
        return response.data;
    })
}

export const configurationService = {
    getApplicationConfiguration: getApplicationConfiguration,
};