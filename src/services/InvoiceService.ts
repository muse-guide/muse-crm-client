import api, {getAuthHeaders, requestWrapper} from "../http/client"
import {Invoice, InvoiceDetails} from "../model/invoice";
import {Exhibit} from "../model/exhibit";

const entityPath = `/invoices`;

async function getCustomerInvoicesForPeriod(from: string, to: string): Promise<Invoice[]> {
    return await requestWrapper(async () => {
        const path = `${entityPath}`;
        const response = await api.get<Invoice[]>(path, {
            ...await getAuthHeaders(),
            params: {
                "from": from,
                "to": to
            }
        });
        return response.data;
    })
}

async function getInvoice(id: string): Promise<InvoiceDetails> {
    return await requestWrapper(async () => {
        const path = `${entityPath}/${id}`;
        const response = await api.get<InvoiceDetails>(path, {...await getAuthHeaders()});
        return response.data;
    })
}

export const invoiceService = {
    getCustomerInvoicesForPeriod: getCustomerInvoicesForPeriod,
    getInvoice: getInvoice
};