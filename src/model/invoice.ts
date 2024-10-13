export interface Invoice {
    invoiceId: string,
    invoiceBusinessId: string,
    periodStart: string,
    periodEnd: string,
    paymentDue: string,
    amount: string,
    status: string
}

export interface InvoiceDetails {
    invoiceId: string,
    invoiceBusinessId: string,
    periodStart: string,
    periodEnd: string,
    paymentDue: string,
    amount: string,
    status: string,
    issuedAt: string,
    soldAt: string,
    invoiceItems: InvoiceItem[]
}

export interface InvoiceItem {
    plan: string,
    activeFrom: string,
    activeTo: string,
    amount: string,
}

export type InvoicePaymentStatus = "ALL" | "PAID" | "UNPAID"
