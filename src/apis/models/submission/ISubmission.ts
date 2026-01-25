 interface ISubmission {
    userId: string; 
    problemId: string;
    code: string;           
    language: string;
    status: 'Pending' | 'Accepted' | 'Wrong Answer' | 'TLE' | 'Runtime Error';
    testCasesPassed: number;
    totalTestCases: number;
    runtime: string;   
    memory: string;         
}

export default ISubmission