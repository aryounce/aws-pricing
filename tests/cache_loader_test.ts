import { TestSuite } from "./_framework/test_suite";
import { TestRun } from "./_framework/test_run";
import { CacheLoader } from "../src/cache_loader";

export class CacheLoaderTestSuite extends TestSuite {
    protected name(): string {
        return this.constructor.name
    }
    
    protected run(t: TestRun): void {
        t.describe("CacheLoader tests", () => {
            let cache = new CacheLoader(CacheService.getScriptCache())
            let key = this.newKey()

            let testStr = "this is a test string we hope to get back"

            cache.put(key, testStr, 60)

            let out = cache.get(key)

            t.areEqual(testStr, out)

            let testStr2 = "this is a new string"

            cache.put(key, testStr2, 60)
            out = cache.get(key)

            t.areEqual(testStr2, out)

            key = this.newKey() + "2"

            out = cache.get(key)
            t.isTrue(out == null)
        })
    }

    private newKey(): string {
        return Utilities.formatString("test_%s", Date.now())
    }

}