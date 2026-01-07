import { Repositery } from "../repository/Repositery";
import { Service } from "./Service";

export class ServiceImpl<T> implements Service<T> {
    private repo : Repositery<T>;

    constructor(TableName: string) {
        this.repo = new Repositery<T>(TableName);
    }

    async create(data: T | null): Promise<T | null> {
        try{
            return await this.repo.create(data);
        }catch(err){
            throw new Error(err);
        }
    }

    findById(id: string): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    updateById(id: string, data: Partial<T>): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    deleteById(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
    async findAll(): Promise<T[]> {
        try{
            return await this.repo.getAll();
        }catch(err){
            throw new Error(err);
        }
    }


}

