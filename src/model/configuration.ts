import {Customer} from "./customer";

export interface SubscriptionPlan {
    type: string,
    price: number,
    maxExhibitions: number,
    maxExhibits: number,
    maxLanguages: number,
}

export interface InvoicePeriod {
    periodStart: string,
    periodEnd: string,
}

export interface ApplicationConfiguration {
    subscriptionPlans: SubscriptionPlan[],
    lastInvoicedPeriod: InvoicePeriod,
}

export interface ApplicationContext {
    configuration: ApplicationConfiguration,
    customer: Customer,
    setCustomer: (customer: Customer) => void,
}