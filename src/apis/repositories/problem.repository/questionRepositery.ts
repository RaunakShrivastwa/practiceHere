import dataBase from "../../../config/db.config/dataBase.js";
import { Question } from "../../models/question.model/Question.js";

export class QuestionRepository {
    private tableName: string;
    private pool: any;

    constructor(tableName: string) {
        this.tableName = tableName;
        this.pool = dataBase.getPool();

    }

    // create table method
    async createTable(): Promise<string> {
        try {
            const query = `
                CREATE TABLE IF NOT EXISTS ${this.tableName} (
                    id SERIAL PRIMARY KEY,
                    description TEXT NOT NULL,
                    constraints TEXT,               -- constraint field
                    example TEXT,                  -- example field
                    test_case TEXT,                -- testCase field
                    tags JSONB DEFAULT '[]',       -- string[] ke liye JSONB best hai
                    level VARCHAR(20),             -- Easy, Medium, Hard
                    supported_languages JSONB,     -- string[] ke liye
                    created_by VARCHAR(100),       -- createdBy field
                    company_tags JSONB DEFAULT '[]', -- companyTags field
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
    `;

            await this.pool.query(query);
            return "Question table created successfully";
        } catch (err: any) {
            return `Error creating ${this.tableName} table: ${err.message}`;
        }
    }

    async createQuestion(Question: Question): Promise<Question> {
        // ✅ Get pool here inside the method

        const columns: string[] = [];
        const placeholders: string[] = [];
        const values: any[] = [];

        for (const key in Question) {
            columns.push(key);
            placeholders.push(`$${columns.length}`);
            values.push((Question as any)[key]);
        }

        const query = `
      INSERT INTO ${this.tableName} (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *;
    `;

        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async getAllQuestions(): Promise<Question[]> {

        const query = `SELECT * FROM ${this.tableName};`;
        const result = await this.pool.query(query);
        return result.rows;
    }

    async getQuestionById(id: number): Promise<Question | null> {

        const query = `SELECT * FROM ${this.tableName} WHERE id = $1;`;
        const result = await this.pool.query(query, [id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async updateById(id: number, Question: Question): Promise<Question | null> {
        const fields = Object.keys(Question);
        const set = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
        const query = `UPDATE ${this.tableName} SET ${set} WHERE id = ${id} RETURNING *`;
        return (await this.pool.query(query, Object.values(Question))).rows[0];
    }

    async deleteQuestion(id: number): Promise<boolean> {

        const query = `DELETE FROM ${this.tableName} WHERE id = $1;`;
        const result = await this.pool.query(query, [id]);
        return result.rowCount > 0;
    }

}
