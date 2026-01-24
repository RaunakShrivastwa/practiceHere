import { UserRole, UserStatus } from "../../../types/typeRole";
import { IUser } from "./UserI";

export class User {
    // Fields ko initialize karne ka shorthand tarika
    public id: string;
    public name: string;
    public username: string;
    public email: string;
    public password: string;
    public role: UserRole;
    public country: string;
    public linkedInProfile: string;
    public githubProfile: string;
    public website: string;
    public bio: string;
    public status: UserStatus;
    public refreshToken: string;
    public totalQuestionsSolved: number;
    public easyQuestionsSolved: number;
    public mediumQuestionsSolved: number;
    public hardQuestionsSolved: number;
    public totalSubmissions: number;
    public correctSubmissions: number;
    public createdAt: Date;
    public updatedAt: Date;


    // Constructor mein pura object pass ho raha hai
    constructor(data: IUser) {
        this.id = data.id;
        this.name = data.name;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role;
        this.country = data.country;
        this.linkedInProfile = data.linkedInProfile;
        this.githubProfile = data.githubProfile;
        this.website = data.website;
        this.bio = data.bio;
        this.status = data.status;
        this.refreshToken = data.refreshToken;
        this.totalQuestionsSolved = data.totalQuestionsSolved;
        this.easyQuestionsSolved = data.easyQuestionsSolved;
        this.mediumQuestionsSolved = data.mediumQuestionsSolved;
        this.hardQuestionsSolved = data.hardQuestionsSolved;
        this.totalSubmissions = data.totalSubmissions;
        this.correctSubmissions = data.correctSubmissions;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
    }
}