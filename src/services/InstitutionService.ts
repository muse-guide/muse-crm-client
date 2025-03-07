import api, {getAuthHeaders, requestWrapper} from "../http/client"
import {CreateInstitution, Institution} from "../model/institution";

const entityPath = `/institutions`;

async function getInstitutionForCustomer(): Promise<Institution | undefined> {
    return await requestWrapper(async () => {
        const response = await api.get<Institution>(entityPath, {...await getAuthHeaders()});
        return response.data;
    })
}

async function createInstitution(data: CreateInstitution): Promise<Institution> {
    return await requestWrapper(async () => {
        const response = await api.post<Institution>(entityPath, data, {...await getAuthHeaders()});
        return response.data;
    })
}

async function updateInstitution(data: Institution): Promise<Institution> {
    return await requestWrapper(async () => {
        const response = await api.put<Institution>(`${entityPath}/${data.id}`, data, {...await getAuthHeaders()});
        return response.data;
    })
}

export const institutionService = {
    getInstitutionForCustomer: getInstitutionForCustomer,
    createInstitution: createInstitution,
    updateInstitution: updateInstitution,
};
