export interface Customer {
    customerId: string
    email: string
    status: string
    subscription: {
        subscriptionId: string
        plan: string
        status: string
        startedAt: string
        expiredAt: string | undefined
    }
}