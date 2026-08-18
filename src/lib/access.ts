import type { Access } from 'payload'

/** Anyone signed into the admin. There is only ever one account — the client's. */
export const isAdmin: Access = ({ req: { user } }) => Boolean(user)

export const isPublic: Access = () => true
