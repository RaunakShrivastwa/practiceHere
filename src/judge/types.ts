export interface TestCase {
    input: any;
    expected: any;
}

export interface JudgeReport {
    testCaseId: number;
    passed: boolean;
    status: 'Accepted' | 'Wrong Answer' | 'TLE' | 'Runtime Error' | 'Compile Error';
    runtime: string;
    expected: any;
    actual: any;
    error?: string;
}