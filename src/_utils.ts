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
}