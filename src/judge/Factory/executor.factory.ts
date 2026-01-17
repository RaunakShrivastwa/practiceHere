import { JsExecutor } from '../executors/js.executor';
import { JavaExecutor } from '../executors/java.executor';
import { CppExecutor } from '../executors/cpp.executor';

export class JudgeFactory {
    static getExecutor(language: string) {
        switch (language.toLowerCase()) {
            case 'javascript':
            case 'js':
                return new JsExecutor();
            case 'java':
                return new JavaExecutor();
            case 'cpp':
            case 'c++':
                return new CppExecutor();
            default:
                throw new Error(`Language ${language} not supported!`);
        }
    }
}