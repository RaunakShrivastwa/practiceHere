export interface Service<T> {
    create(data: T | null): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    updateById(id: string, data: Partial<T>): Promise<T | null>;
    deleteById(id: string): Promise<boolean>;
    findAll(): Promise<T[]>;
    
}