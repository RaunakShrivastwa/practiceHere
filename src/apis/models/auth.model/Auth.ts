import { UserRole, UserStatus } from "../../../types/typeRole";
import { IAuth } from "./AuthI";

export class User {
    // Fields ko initialize karne ka shorthand tarika
    public id: string;
    public user_id: string;
    public token: string;
    public is_revoked: boolean;
    public createdAt: Date;
    public updatedAt: Date;


    // Constructor mein pura object pass ho raha hai
    constructor(data: IAuth) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.token = data.token;
        this.is_revoked = data.is_revoked;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
    }
}