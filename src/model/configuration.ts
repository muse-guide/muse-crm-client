import {Customer} from "./customer";

export interface SubscriptionPlan {
    type: string,
    name: string,
    price: number,
    durationMonths: number,
    maxExhibitions: number,
    maxExhibits: number,
    maxLanguages: number,
    tokenCount: number,
}

export interface ApplicationConfiguration {
    subscriptionPlans: SubscriptionPlan[],
}

export interface ApplicationContext {
    configuration: ApplicationConfiguration,
    customer: Customer,
    setCustomer: (customer: Customer) => void,
    refreshCustomer: () => void,
}