export interface Customer {
    customerId: string
    email: string
    status: string
    fullName?: string
    taxNumber?: string
    telephoneNumber?: string
    subscription: {
        subscriptionId: string
        plan: string
        status: string
        startedAt: string
        expiredAt: string | undefined
        tokenCount: number
    }
    address?: Address
}

export interface Address {
    street?: string
    houseNumber?: string
    houseNumberExtension?: string
    city?: string
    zipCode?: string
    country?: string
}