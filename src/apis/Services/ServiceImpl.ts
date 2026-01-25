import { Repositery } from "../repository/Repositery";
import { Service } from "./service";

export class ServiceImpl<T> implements Service<T> {
    private repo: Repositery<T>;

    constructor(TableName: string) {
        this.repo = new Repositery<T>(TableName);
    }

    async create(data: T | null): Promise<T | null> {
        try {
            return await this.repo.create(data);
        } catch (err) {
            throw new Error(err);
        }
    }

    async createMany(data: T[]): Promise<T[]> {
        return await this.repo.createMany(data);
    }


    findById(id: string): Promise<T | null> {
        try {
            return this.repo.findByID(id);
        } catch (err) {
            throw new Error(err);
        }
    }

    findByEmail(email: string): Promise<T | null> {
        try {
            return this.repo.findByEmail(email);
        } catch (err) {
            throw new Error(err);
        }
    }

    updateById(id: string, data: Partial<T>): Promise<T | null> {
        try {
            return this.repo.updateById(id, data);
        } catch (err) {
            throw new Error(err);
        }
    }

    deleteById(id: string): Promise<boolean> {
        try {
            return this.repo.delete(id);
        } catch (err) {
            throw new Error(err);
        }
    }

    deleteByEmail(email: string): Promise<boolean> {
        try {
            return this.repo.deleteByEmail(email);
        } catch (err) {
            throw new Error(err);
        }
    }

    async findAll(): Promise<T[]> {
        try {
            return await this.repo.getAll();
        } catch (err) {
            throw new Error(err);
        }
    }

    findByEmailOrUserName(email: string, username: string): Promise<T | null> {
        try {
            return this.repo.findByEmailOrUserName(email, username);
        } catch (error) {
            throw new Error(error);
        }
    }
}

