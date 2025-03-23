export type ActiveUser = {
    userId: string,
    displayName: string
}

export type DropinData = {
    capacity: number,
    num_active_users: number,
    active_users_list: Array<ActiveUser>
}