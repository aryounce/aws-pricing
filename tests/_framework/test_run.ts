import { TestResult } from "./test_result";

// Adapted from: https://gist.github.com/danbernier/a15b4073bb5ab13b1864
//

interface SingleTestFunction {
    (): void
}

interface TestAndRecordFunction {
    (): boolean
}

export class TestRun {
    private successes = 0
    private failures = []
    private scopes = []
    private suiteName = null

    setSuiteName(name: string) {
        this.suiteName = name
    }

    clearSuiteName() {
        this.suiteName = null
    }

    describe(blockName: string, fnOneTest: SingleTestFunction) {
        let scopeName = blockName;

        if (this.suiteName != null) {
            scopeName = Utilities.formatString("[%s] %s", this.suiteName, scopeName)
        }

        this.scopes.push(scopeName);
        try {
            fnOneTest();
        } catch (x) {
            this.failures.push(this.msgInScope(`Failed in block '${scopeName}': ${x}`))
        }
        this.scopes.pop();
    }

    areClose(expected: number, actual: number, epsilon: number) {
        let msg = "Expected " + expected + " (+/- " + epsilon + "), got " + actual + "."
        this.runTestAndRecordResult(msg, function() {
            return Math.abs(expected - actual) <= epsilon;
        })
    
    }

    areNotEqual(a: any, b: any) {
        this.equalityCompare(a, b, false)
    }

    areEqual(expected: any, actual: any) {
        this.equalityCompare(expected, actual, true)
    }

    isTrue(value: boolean) {
        this.runTestAndRecordResult(`Expected a boolean value of true, actual: ${value}`, function() {
            return value == true;
        })
    }

    isFalse(value: boolean) {
        this.runTestAndRecordResult(`Expected a boolean value of false, actual: ${value}`, function() {
            return value == false;
        })
    }

    willThrow(fnThatThrows: SingleTestFunction, msgMatch?: string) {
        let threw = false
        let matched = false
        let threwMsg = null

        try {
            fnThatThrows()
        } catch (x) {
            threw = true
            threwMsg = this.exceptionToString(x).toLowerCase()
            if (msgMatch) {
                matched = threwMsg.indexOf(msgMatch.toLowerCase()) !== -1
            }
        }

        let testMsg = null
        
        if (msgMatch) {
            testMsg = Utilities.formatString("Expected to throw exception matching '%s', but %s",
                msgMatch, threw ? 'did throw' : 'did not throw')
            if (threwMsg != null) {
                testMsg += Utilities.formatString(", but with error '%s'", threwMsg)
            }
        } else {
            testMsg = Utilities.formatString("Expected to throw exception, but did not throw")
        }
        this.runTestAndRecordResult(testMsg, function() {
            return threw && (!msgMatch || matched)
        })
    }
    
    equalityCompare(expected: any, actual: any, equal: boolean) {
        if (Array.isArray(expected) && Array.isArray(actual)) {
            return this.areListsEqual(expected, actual, equal)
        }

        let msg = null
        if (equal) {
            msg = Utilities.formatString("Expected '%s(%s)' but got '%s(%s)'.",
                expected.constructor.name, expected, actual.constructor.name, actual)
        } else {
            msg = Utilities.formatString("Expected '%s(%s)' != '%s(%s)', but were same.",
                expected.constructor.name, expected, actual.constructor.name, actual)
        }

        this.runTestAndRecordResult(msg, function() {
            let result = expected === actual;

            return (equal ? result : !result)
        })
    }

    getResult(): TestResult {
        return new TestResult(this.successes, this.failures)
    }

    private exceptionToString(e: any): string {
        if (e instanceof Error) {
            return e.message
        } else if (typeof e === 'string' || e instanceof String) {
            return e.toString()
        } else if (typeof e === 'number' || e instanceof Number) {
            return e.toString()
        } else if (typeof e == 'boolean' || e instanceof Boolean) {
            return `${e}`
        }

        throw `Unknown exception type: ${e}`
    }

    private areListsEqual(expected: Array<any>, actual: Array<any>, equal: boolean) {
        let msg = null
        
        if (equal) {
            msg = Utilities.formatString("Expected '[%s]', but got '[%s]'.", expected, actual)
        } else {
            msg = Utilities.formatString("Expected '[%s]' != '[%s]', but were same.", expected, actual)
        }
        
        this.runTestAndRecordResult(msg, () => {
            let result = this.doTheseListsMatch(expected, actual)
            return equal ? result : !result
        })
    }

    private msgInScope(msg: string): string {
        return this.scopes.concat([msg]).join(": ");
    }

    private runTestAndRecordResult(message: string, fn: TestAndRecordFunction) {
        try {
            if (fn()) {
                this.successes += 1;
            } else {
                this.failures.push(this.msgInScope(message));
            }
        }
        catch(x) {
            this.failures.push(this.msgInScope(x));
        }
    }

    private doTheseListsMatch(expected: Array<any>, actual: Array<any>) {
        if (expected.length != actual.length) {
          return false;
        }
    
        for (var i = 0; i < expected.length; i++) {
            if (expected[i].constructor === Array && actual[i].constructor === Array) {
                if (!this.doTheseListsMatch(expected[i], actual[i])) {
                    return false;
                }
            } else if (expected[i] !== actual[i]) {
                return false;
            }
        }

        return true;
    }
}