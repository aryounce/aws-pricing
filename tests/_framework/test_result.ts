export class TestResult {
    private statusMsg = null

    constructor(private readonly successes: number,
        private readonly failures: Array<string>) {
    }

    totalTests(): number {
        return this.successes + this.failures.length
    }

    isFailed(): boolean {
        return this.failures.length > 0
    }

    statusMessage(): string {
        if (this.statusMsg == null) {
            this.statusMsg = this.buildStatusMsg()
        }

        return this.statusMsg
    }

    private buildStatusMsg(): string {
        let msg = Utilities.formatString("%s\nTest Run: %d total tests (%d successes, %d failures)",
            this.isFailed() ? "FAILED!" : "SUCCESS!",
            this.totalTests(), this.successes, this.failures.length)

        if (this.isFailed()) {
            msg += Utilities.formatString("\n\nFailures:\n--------\n%s", this.failures.join("\n"))
        }

        return msg
    }

}