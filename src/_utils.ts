export class Utils {
    public static lookupMap(values: Array<string>): {[key: string]: boolean} {
        return values.reduce(function(map, elem) {
            map[elem] = true
            return map
        }, {})
    }
}