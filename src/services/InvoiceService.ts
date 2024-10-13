import api, {getAuthHeaders, requestWrapper} from "../http/client"
import {InvoiceDetails, InvoicePaymentStatus} from "../model/invoice";
import {PaginatedResults} from "../http/types";

const entityPath = `/invoices`;

async function getCustomerInvoices(paymentStatus: InvoicePaymentStatus, nextPageKey?: string): Promise<PaginatedResults> {
    return await requestWrapper(async () => {
        const path = `${entityPath}`;
        const response = await api.get<PaginatedResults>(path, {
            ...await getAuthHeaders(),
            params: {
                "paymentStatus": paymentStatus,
                "page-size": 10,
                "next-page-key": nextPageKey
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
    getCustomerInvoices: getCustomerInvoices,
    getInvoice: getInvoice
};