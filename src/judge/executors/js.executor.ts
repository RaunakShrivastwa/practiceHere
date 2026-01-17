import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';
import { TestCase, JudgeReport } from '../types';

const execPromise = promisify(exec);

export class JsExecutor {
    private tempDir: string;
    private fileName: string;
    private filePath: string;

    constructor() {
        this.tempDir = path.join(__dirname, '../../../temp');
        if (!fs.existsSync(this.tempDir)) fs.mkdirSync(this.tempDir);
        console.log(this.tempDir);
        
        this.fileName = `solution_${Date.now()}.js`;
        this.filePath = path.join(this.tempDir, this.fileName);
    }

    public async run(userCode: string, testCases: TestCase[]): Promise<JudgeReport[]> {
        const reports: JudgeReport[] = [];

        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            
            // Step 1: Wrapper Code Taiyar Karo
            const wrapperCode = this.generateWrapper(userCode, tc);
            fs.writeFileSync(this.filePath, wrapperCode);

            // Step 2: Docker Command Execute Karo
            const startTime = performance.now();
            try {
                // Security Note: memory limit and no-network added
                const { stdout } = await execPromise(
                    `docker run --rm --network none --memory="128m" -v "${this.tempDir}:/app" -w /app node:18-alpine node ${this.fileName}`,
                    { timeout: 5000 }
                );

                const endTime = performance.now();
                const actual = JSON.parse(stdout.trim());
                const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);

                reports.push({
                    testCaseId: i + 1,
                    passed,
                    status: passed ? 'Accepted' : 'Wrong Answer',
                    runtime: `${(endTime - startTime).toFixed(2)}ms`,
                    expected: tc.expected,
                    actual
                });

            } catch (err: any) {
                reports.push(this.handleError(err, i, tc));
            }
        }

        this.cleanup();
        return reports;
    }
    
    private generateWrapper(userCode: string, tc: TestCase): string {
        const encodedInput = Buffer.from(JSON.stringify(tc.input)).toString('base64');
        return `
            ${userCode}
            const input = JSON.parse(Buffer.from("${encodedInput}", 'base64').toString());
            try {
                const sol = new Solution();
                // 'solve' function ka naam uniform hona chahiye
                const result = sol.solve(input);
                process.stdout.write(JSON.stringify(result));
            } catch(e) { 
                process.stderr.write(e.message); 
                process.exit(1); 
            }
        `;
    }

    private handleError(err: any, i: number, tc: TestCase): JudgeReport {
        const isTLE = err.killed || err.message?.includes('timeout');
        return {
            testCaseId: i + 1,
            passed: false,
            status: isTLE ? 'TLE' : 'Runtime Error',
            runtime: 'N/A',
            expected: tc.expected,
            actual: null,
            error: err.stderr || err.message
        };
    }

    private cleanup() {
        if (fs.existsSync(this.filePath)) {
            fs.unlinkSync(this.filePath);
        }
    }
}