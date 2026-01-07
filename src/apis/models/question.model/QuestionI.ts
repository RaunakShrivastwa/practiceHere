export interface IQuestion {
    id: string;
    description: string;
    constraint: string;
    example: string;
    testCase: string;
    tag: string[];
    level: Level;
    supportedLanguages: string[];
    createdBy: string;
    companyTags: string[];
}