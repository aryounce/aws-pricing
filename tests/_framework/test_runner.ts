import { TestRun } from "./test_run";

interface TestRunnerFunction {
    (testRun: TestRun): void
}

export class TestRunner {
    static runAllTests(fnTestBlock: TestRunnerFunction): string {
        let tr = new TestRun()
        fnTestBlock(tr)

        let result = tr.getResult()
        
        TestRunner.alert(result.statusMessage())

        return result.statusMessage()
    }

    private static alert(msg: string) {
        try {
            let ui = SpreadsheetApp.getUi()
            ui.alert(msg)
        } catch (x) {
            Logger.log(msg)
        }
    }
}