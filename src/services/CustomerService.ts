import {CreateExhibit, Exhibit} from "../model/exhibit";
import api, {getAuthHeaders, normalize, requestWrapper} from "../http/client"
import {PaginatedResults, ApiPagination,} from "../http/types";
import {Customer} from "../model/customer";

const entityPath = `/customers`;

async function getCurrentCustomer(): Promise<Customer> {
    return await requestWrapper(async () => {
        const path = `${entityPath}/current`;
        const response = await api.get<Customer>(path, {...await getAuthHeaders()});
        return response.data;
    })
}

async function updateCustomerDetails(detailsToUpdate: Customer): Promise<Customer> {
    return await requestWrapper(async () => {
        const path = `${entityPath}/details`;
        const response = await api.put<Customer>(path, detailsToUpdate, {...await getAuthHeaders()});
        return response.data;
    })
}

async function changeSubscription(newPlan: string): Promise<Customer> {
    return await requestWrapper(async () => {
        const path = `${entityPath}/subscriptions`;
        const response = await api.put<Customer>(path, {newPlan}, {...await getAuthHeaders()});
        return response.data;
    })
}

export const customerService = {
    getCurrentCustomer: getCurrentCustomer,
    updateCustomerDetails: updateCustomerDetails,
    changeSubscription: changeSubscription
};