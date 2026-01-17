import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';
import { TestCase, JudgeReport } from '../types';

const execPromise = promisify(exec);

export class JavaExecutor {
    private tempDir: string;
    private jobPath: string;
    private fileName: string = 'Main.java';

    constructor() {
        // 1. Temp directory setup
        this.tempDir = path.join(__dirname, '../../../temp');
        if (!fs.existsSync(this.tempDir)) fs.mkdirSync(this.tempDir);

        // 2. Har submission ke liye unique folder taaki files mix na hon
        const folderName = `java_job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        this.jobPath = path.join(this.tempDir, folderName);
        fs.mkdirSync(this.jobPath);
    }

    public async run(userCode: string, testCases: TestCase[]): Promise<JudgeReport[]> {
        const filePath = path.join(this.jobPath, this.fileName);
        const reports: JudgeReport[] = [];

        try {
            // STEP 1: Wrapper Code Generate karna aur save karna
            const fullCode = this.generateWrapper(userCode);
            fs.writeFileSync(filePath, fullCode);

            // STEP 2: Compilation (Sirf ek baar compilation kaafi hai)
            // Hum Docker use kar rahe hain taaki host machine par Java install na karni pade
            await execPromise(
                `docker run --rm -v "${this.jobPath}:/app" -w /app eclipse-temurin:17-alpine javac Main.java`,
                { timeout: 15000 }
            );

            // STEP 3: Har TestCase ko baari-baari run karna
            for (let i = 0; i < testCases.length; i++) {
                const tc = testCases[i];
                // Input ko Base64 kar rahe hain taaki special characters shell ko break na karein
                const encodedInput = Buffer.from(JSON.stringify(tc.input)).toString('base64');
                
                const startTime = performance.now();
                try {
                    const { stdout } = await execPromise(
                        `docker run --rm --network none --memory="512m" -v "${this.jobPath}:/app" -w /app eclipse-temurin:17-alpine java Main ${encodedInput}`,
                        { timeout: 5000 }
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
            // Agar javac fail hua toh seedha Compile Error return karo
            return [{
                testCaseId: 0,
                passed: false,
                status: 'Compile Error',
                runtime: 'N/A',
                expected: null,
                actual: null,
                error: compileErr.stderr || "Java Compilation Failed"
            }];
        } finally {
            // STEP 4: Kaam khatam hone ke baad temporary files delete kar do
            this.cleanup();
        }

        return reports;
    }

    private generateWrapper(userCode: string): string {
        // Yahan regex ko simple rakha hai (replace chain) taaki JS backticks ke saath clash na ho
        return `
import java.util.*;

${userCode}

public class Main {
    public static void main(String[] args) {
        try {
            if (args.length == 0) return;

            // Base64 Input Decoding
            byte[] decodedBytes = Base64.getDecoder().decode(args[0]);
            String inputStr = new String(decodedBytes);
            
            // Cleaning Input: Remove brackets and spaces
            String cleanInput = inputStr.replace("[", "").replace("]", "").replace(" ", "");
            String[] items = cleanInput.split(",");
            
            int[] nums = new int[items.length];
            for (int i = 0; i < items.length; i++) {
                nums[i] = Integer.parseInt(items[i].trim());
            }

            // User ki Solution class call karna
            Solution sol = new Solution();
            System.out.print(sol.arraySum(nums));

        } catch (Exception e) {
            System.err.println(e.getMessage());
            System.exit(1);
        }
    }
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
        if (fs.existsSync(this.jobPath)) {
            // Recursive true taaki poora folder delete ho jaye (.class files ke saath)
            fs.rmSync(this.jobPath, { recursive: true, force: true });
        }
    }
}