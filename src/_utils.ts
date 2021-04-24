export class Utils {
    public static lookupMap(values: Array<string>): {[key: string]: boolean} {
        return values.reduce(function(map, elem) {
            map[elem] = true
            return map
        }, {})
    }

    public static slice(map: {[key: string]: any}, keys: string[]): {[key: string]: any} {
        let ret = {}

        for (let key of keys) {
            ret[key] = map[key]
        }

        return ret
    }

    // Not available in ES5
    public static includes(str: string, substr: string): boolean {
        return str && str.indexOf(substr) !== -1
    }

    public static endsWith(str: string, search: string): boolean {
        if (!str) {
            return false
        }

        if (search.length > str.length) {
            return false
        }

        return str.substring(str.length - search.length, str.length) === search;
    }
}
