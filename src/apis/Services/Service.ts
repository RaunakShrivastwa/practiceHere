export interface Service<T> {
    create(data: T | null): Promise<T | null>;
    createMany(data: T[]): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    findByEmail(email: string): Promise<T | null>;
    updateById(id: string, data: Partial<T>): Promise<T | null>;
    deleteById(id: string): Promise<boolean>;
    deleteByEmail(email: string): Promise<boolean>;
    findAll(): Promise<T[]>;
}