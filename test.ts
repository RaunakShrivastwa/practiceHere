import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks'; // Time complexity/Execution time ke liye

const execPromise = promisify(exec);

interface TestCase {
    input: number[];
    expected: number;
}

async function runJavaJudge(userCode: string, testCases: TestCase[]) {
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const filePath = path.join(tempDir, 'Main.java');

    const fullCode = `
import java.util.Base64;
${userCode}
public class Main {
    public static void main(String[] args) {
        try {
            if (args.length == 0) return;
            byte[] decodedBytes = Base64.getDecoder().decode(args[0]);
            String inputStr = new String(decodedBytes);
            String cleanInput = inputStr.trim().replace("[", "").replace("]", "").replace(" ", "");
            int[] nums;
            if (cleanInput.isEmpty()) {
                nums = new int[0];
            } else {
                String[] items = cleanInput.split(",");
                nums = new int[items.length];
                for (int i = 0; i < items.length; i++) {
                    nums[i] = Integer.parseInt(items[i]);
                }
            }
            Solution sol = new Solution();
            System.out.print(sol.arraySum(nums));
        } catch (Exception e) {
            System.err.println(e.getMessage());
            System.exit(1);
        }
    }
}
    `;

    fs.writeFileSync(filePath, fullCode);

    const reports = [];

    for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const inputStr = JSON.stringify(tc.input);
        const encodedInput = Buffer.from(inputStr).toString('base64');

        // Time Note karein
        const startTime = performance.now();

        try {
            // Humne image badal kar 'eclipse-temurin' kar di hai jo fast download hoti hai
            const { stdout } = await execPromise(
                `docker run --rm -v "${tempDir}:/app" -w /app eclipse-temurin:17-alpine sh -c "javac Main.java && java Main ${encodedInput}"`,
                { timeout: 15000 } // Java slow hai isliye 15s timeout
            );

            const endTime = performance.now();
            const executionTime = (endTime - startTime).toFixed(2);

            const actual = parseInt(stdout.trim());
            const passed = actual === tc.expected;

            reports.push({
                testCaseId: i + 1,
                passed: passed,
                status: passed ? 'Accepted' : 'Wrong Answer',
                runtime: `${executionTime}ms`, // Runtime column
                expected: tc.expected,
                actual: isNaN(actual) ? stdout.trim() : actual
            });

        } catch (err: any) {
            const isTLE = err.killed || (err.message && err.message.includes('timeout'));
            reports.push({
                testCaseId: i + 1,
                passed: false,
                status: isTLE ? 'TLE' : 'Compile/Runtime Error',
                runtime: 'N/A',
                expected: tc.expected,
                actual: null,
                error: err.stderr || "Docker image pulling or Code Error"
            });
        }
    }
    return reports;
}

// --- Testing ---
const javaUserCode = `
class Solution {
    public int arraySum(int[] nums) {
        int sum = 0;
        for(int n : nums) sum += n;
        return sum;
    }
}
`;

const myTestCases: TestCase[] = [
    { input: [1, 2, 3, 4], expected: 10 },
    { input: [10, 20, 30], expected: 60 }
];

runJavaJudge(javaUserCode, myTestCases).then(report => {
    console.log("JAVA JUDGEMENT REPORT (With Runtime):");
    console.table(report);
});