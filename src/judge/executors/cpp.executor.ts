import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';
import { TestCase, JudgeReport } from '../types';

const execPromise = promisify(exec);

export class CppExecutor {
    private tempDir: string;
    private baseName: string;
    private cppFilePath: string;
    private binaryPath: string;

    constructor() {
        this.tempDir = path.join(__dirname, '../../../temp');
        if (!fs.existsSync(this.tempDir)) fs.mkdirSync(this.tempDir);

        // Unique filename taaki concurrent submissions clash na karein
        this.baseName = `solution_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        this.cppFilePath = path.join(this.tempDir, `${this.baseName}.cpp`);
        this.binaryPath = path.join(this.tempDir, this.baseName);
    }

    public async run(userCode: string, testCases: TestCase[]): Promise<JudgeReport[]> {
        const reports: JudgeReport[] = [];

        try {
            // STEP 1: Wrapper Code Generate karna
            const fullCode = this.generateWrapper(userCode);
            fs.writeFileSync(this.cppFilePath, fullCode);

            // STEP 2: Compilation (g++ use karke binary banana)
            // -o flag se hum ek executable binary file banate hain
            await execPromise(
                `docker run --rm -v "${this.tempDir}:/app" -w /app gcc:11 g++ ${this.baseName}.cpp -o ${this.baseName}`,
                { timeout: 15000 }
            );

            // STEP 3: Execution (Binary ko run karna har testcase ke liye)
            for (let i = 0; i < testCases.length; i++) {
                const tc = testCases[i];
                // Array [1,2,3] ko space-separated string "1 2 3" mein convert karna
                const inputStr = Array.isArray(tc.input) ? tc.input.join(" ") : tc.input;

                const startTime = performance.now();
                try {
                    const { stdout } = await execPromise(
                        `docker run --rm --network none --memory="128m" -v "${this.tempDir}:/app" -w /app gcc:11 ./${this.baseName} "${inputStr}"`,
                        { timeout: 2000 } // C++ is super fast, 2s is plenty
                    );

                    const endTime = performance.now();
                    const actual = parseInt(stdout.trim());
                    const passed = actual === tc.expected;

                    reports.push({
                        testCaseId: i + 1,
                        passed,
                        status: passed ? 'Accepted' : 'Wrong Answer',
                        runtime: `${(endTime - startTime).toFixed(2)}ms`,
                        expected: tc.expected,
                        actual
                    });
                } catch (runErr: any) {
                    reports.push(this.handleError(runErr, i, tc, "Runtime"));
                }
            }
        } catch (compileErr: any) {
            return [{
                testCaseId: 0,
                passed: false,
                status: 'Compile Error',
                runtime: 'N/A',
                expected: null,
                actual: null,
                error: compileErr.stderr || "C++ Compilation Failed"
            }];
        } finally {
            this.cleanup();
        }

        return reports;
    }

    private generateWrapper(userCode: string): string {
        return `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

${userCode}

int main(int argc, char** argv) {
    if (argc < 2) return 1;
    
    // Argv se input string uthana aur vector mein convert karna
    std::string inputStr = argv[1];
    std::stringstream ss(inputStr);
    std::vector<int> nums;
    int n;
    while (ss >> n) nums.push_back(n);

    // User ki Solution class call karna
    Solution sol;
    std::cout << sol.arraySum(nums);
    
    return 0;
}
        `;
    }

    private handleError(err: any, i: number, tc: TestCase, phase: string): JudgeReport {
        const isTLE = err.killed || err.message?.includes('timeout');
        return {
            testCaseId: i + 1,
            passed: false,
            status: isTLE ? 'TLE' : (phase === "Runtime" ? 'Runtime Error' : 'Compile Error'),
            runtime: 'N/A',
            expected: tc.expected,
            actual: null,
            error: err.stderr || err.message
        };
    }

    private cleanup() {
        try {
            if (fs.existsSync(this.cppFilePath)) fs.unlinkSync(this.cppFilePath);
            if (fs.existsSync(this.binaryPath)) fs.unlinkSync(this.binaryPath);
        } catch (e) {
            console.error("Cleanup error:", e);
        }
    }
}