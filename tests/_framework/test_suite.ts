import { TestRun } from "./test_run";

export abstract class TestSuite {
    protected abstract name(): string
    protected abstract run(t: TestRun): void

    test(t: TestRun) {
        t.setSuiteName(this.name())
        this.run(t)
        t.clearSuiteName()
    }
}