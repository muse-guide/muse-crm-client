export interface SubscriptionPlan {
    type: string,
    price: number,
    maxExhibitions: number,
    maxExhibits: number,
    maxLanguages: number,
}

export interface ApplicationConfiguration {
    subscriptionPlans: SubscriptionPlan[]
}