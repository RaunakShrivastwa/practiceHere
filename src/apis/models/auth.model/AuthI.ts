export interface IAuth{
    id: string;
    user_id: string,
    token: string,
    is_revoked: boolean
    createdAt: Date;
    updatedAt: Date;
}