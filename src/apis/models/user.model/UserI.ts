import { UserRole, UserStatus } from "../../../types/typeRole";

export interface IUser {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    country: string;
    linkedInProfile: string;
    githubProfile: string;
    website: string;
    bio: string;
    status: UserStatus;
    totalQuestionsSolved: number;
    easyQuestionsSolved: number;
    mediumQuestionsSolved: number;
    hardQuestionsSolved: number;
    totalSubmissions: number;
    correctSubmissions: number;
    createdAt: Date;
    updatedAt: Date;
}