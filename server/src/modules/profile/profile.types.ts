export interface Profile {
    id: string
    username: string
    displayName: string
    email: string
    avatarUrl: string | null
    status: string
    createdAt: Date
}

export interface UpdatedProfileInput {
    username?: string
    displayName?: string
    avatarUrl?: string | null
}