import dataBase from "../../config/db.config/dataBase";
import { logger } from "../../utils/logger/Logger";

export class Repositery<T> {
    private tableName: string;
    private pool: any;

    constructor(tableName: string) {
        this.tableName = tableName;
        this.pool = dataBase.getPool();
    }

    // Updated create table method
    async createQuestionTable(): Promise<string> {
        try {
            const query = `
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id VARCHAR(100) PRIMARY KEY,       -- Class mein string hai, isliye VARCHAR use kiya
                description TEXT NOT NULL,
                constraints TEXT,               -- 'constraint' SQL reserved word ho sakta hai, isliye constraint_text ya "constraint" use karein
                example TEXT,
                testcase TEXT,                     -- Class property: testcase
                tag TEXT,                          -- Class property: tag (String)
                level VARCHAR(20),                 -- Easy, Medium, Hard
                supportedlanguages JSONB,          -- Class property: supportedlanguages (Array)
                createdby VARCHAR(100),            -- Class property: createdby
                companytags TEXT,                  -- Class property: companytags (Aapne class mein string rakha hai)
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

            await this.pool.query(query);
            logger.info(`Table ${this.tableName} created or already exists.`);
            return "Question table created successfully";
        } catch (err: any) {
            logger.error(`Error: ${err.message}`);
            return `Error creating ${this.tableName} table: ${err.message}`;
        }
    }

    async createUserTable(): Promise<any> {
        // console.log("chut",this.tableName);

        try {
            const query = `
                CREATE TABLE IF NOT EXISTS ${this.tableName} (
                    id VARCHAR(100) PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(100) NOT NULL,
                    username VARCHAR(100) UNIQUE NOT NULL,
                    role VARCHAR(100) NOT NULL,
                    country VARCHAR(100) NOT NULL,
                    linkedInProfile VARCHAR(100),
                    githubProfile VARCHAR(100),
                    website VARCHAR(100),
                    bio TEXT,
                    status VARCHAR(100) NOT NULL,
                    refreshToken VARCHAR(100) NOT NULL,
                    totalQuestionsSolved INTEGER NOT NULL,
                    easyQuestionsSolved INTEGER NOT NULL,
                    mediumQuestionsSolved INTEGER NOT NULL,
                    hardQuestionsSolved INTEGER NOT NULL,
                    totalSubmissions INTEGER NOT NULL,
                    correctSubmissions INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ); 
            `;

            await this.pool.query(query);
            logger.info(`Table ${this.tableName} created or already exists.`);
            return `${this.tableName} table created successfully`;
        } catch (err: any) {
            logger.error(`Error: ${err.message}`);
            throw new Error(err);
        }
    }

    async createAttemptTable(): Promise<string> {
        try {
            const query = `
                CREATE TABLE IF NOT EXISTS ${this.tableName} (
                    id VARCHAR(100) PRIMARY KEY,
                    user_id VARCHAR(100) NOT NULL,
                    question_id VARCHAR(100) NOT NULL,
                    status VARCHAR(100) NOT NULL,
                    passed_test_cases INTEGER NOT NULL,
                    total_test_cases INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;

            await this.pool.query(query);
            logger.info(`Table ${this.tableName} created or already exists.`);
            return "Question table created successfully";
        } catch (err: any) {
            logger.error(`Error: ${err.message}`);
            return `Error creating ${this.tableName} table: ${err.message}`;
        }
    }

    async createAuthTable(): Promise<string> {
        try {
            const query = `
                CREATE TABLE IF NOT EXISTS auth (
                    user_id VARCHAR(100) PRIMARY KEY,
                    CONSTRAINT fk_auth_user
                        FOREIGN KEY (user_id)
                        REFERENCES users(id)
                        ON DELETE CASCADE
                );
            `;
            await this.pool.query(query);

            logger.info(`Table ${this.tableName} created or already exists.`);
            return `${this.tableName} table created successfully`;
        } catch (err: any) {
            logger.error(`Error: ${err.message}`);
            return `Error creating ${this.tableName} table: ${err.message}`;
        }
    }


    // SQL QUERY

    async create(data: T): Promise<T> {
        try {
            const columns: string[] = [];
            const placeholders: string[] = [];
            const values: any[] = [];

            for (const key in data) {
                columns.push(`"${key}"`);
                placeholders.push(`$${columns.length}`);
                const value = (data as any)[key];
                values.push(Array.isArray(value) ? JSON.stringify(value) : value);
            }

            const query = `
            INSERT INTO ${this.tableName} (${columns.join(", ")})
            VALUES (${placeholders.join(", ")})
            RETURNING *;
        `;

            const result = await this.pool.query(query, values);
            return result.rows[0];
        } catch (err: any) {
            // Database level errors ko handle karne ke liye
            let errorMessage = "An unexpected database error occurred";

            if (err.code === '23505') { // Unique constraint violation (e.g. duplicate ID)
                errorMessage = `Duplicate entry: A record with this value already exists.`;
            } else if (err.code === '23502') { // Not null violation
                errorMessage = `Missing required field: ${err.column}`;
            } else if (err.code === '42P01') { // Undefined table
                errorMessage = `Table ${this.tableName} does not exist.`;
            }

            // Error log karein aur reject karein
            console.error(`[DB Error]: ${err.message}`, { code: err.code, detail: err.detail });
            return Promise.reject(new Error(errorMessage));
        }
    }

    async createMany(data: T[]): Promise<T[]> {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Bulk insert data cannot be empty");
        }

        // 1️⃣ Collect all unique columns
        const columns = Array.from(
            new Set(data.flatMap(obj => Object.keys(obj)))
        );

        const values: any[] = [];
        let index = 1;

        // 2️⃣ Build placeholders dynamically
        const placeholders = data.map(row => {
            const rowPlaceholders = columns.map(col => {
                let value = row[col];

                if (value === undefined) value = null;
                if (typeof value === "object" && value !== null) {
                    value = JSON.stringify(value); // JSON / JSONB
                }

                values.push(value);
                return `$${index++}`;
            });

            return `(${rowPlaceholders.join(", ")})`;
        });

        // 3️⃣ Final query
        const query = `
            INSERT INTO ${this.tableName} (${columns.join(", ")})
            VALUES ${placeholders.join(", ")}
            RETURNING *;
        `;

        const result = await this.pool.query(query, values);
        return result.rows;
    }

    async getAll(): Promise<T[]> {
        const query = `SELECT * FROM ${this.tableName};`;
        const result = await this.pool.query(query);
        return result.rows;
    }

    async findByID(id: string): Promise<T | null> {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1;`;
        const result = await this.pool.query(query, [id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async findByEmail(email: string): Promise<T | null> {
        const query = `SELECT * FROM ${this.tableName} WHERE email = $1;`;
        const result = await this.pool.query(query, [email]);
        return result.rows.length ? result.rows[0] : null;
    }

    async delete(id: string): Promise<boolean> {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1;`;
        const result = await this.pool.query(query, [id]);
        return result.rowCount > 0;
    }

    async deleteByEmail(email: String): Promise<boolean> {
        const query = `DELETE FROM ${this.tableName} WHERE email = $1;`;
        const result = await this.pool.query(query, [email]);
        return result.rowCount > 0;
    }

    async updateById(id: string, data: Partial<T>): Promise<T | null> {
        const fields = Object.keys(data);
        const set = fields.map((field, i) => `"${field}" = $${i + 1}`).join(', ');
        const query = `
            UPDATE ${this.tableName}
            SET ${set}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $${fields.length + 1}
            RETURNING *;
        `;

        const values = [...Object.values(data), id];
        const result = await this.pool.query(query, values);
        return result.rows[0] || null;
    }

    async findByEmailOrUserName(email: string, username: string): Promise<T | null> {
        try {
            const query = `SELECT * FROM ${this.tableName} where email = $1 or username = $2`;
            const result = await this.pool.query(query, [email, username]);

            return result.rows.length ? result.rows[0] : null;
        } catch (error) {
            throw new Error(error);
        }
    }
}
