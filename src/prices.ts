let basePriceUri = 'https://a0.p.awsstatic.com'


function buildPriceUrl(urlPath: string) {
    return Utilities.formatString("%s%s", basePriceUri, urlPath);
}

function loadDataUrl(url: string) {
    let resp = UrlFetchApp.fetch(url);  
    if (resp.getResponseCode() != 200) {
        throw "Unable to load the URL: " + url;
    }

    return resp.getContentText();
}

// XXX: assumes no query parameters on base URL
export function loadCacheBustUrl(url: string) {
    // Use timestamp to bust caching
    url = Utilities.formatString("%s?timestamp=%d",
        url, Date.now())

    return loadDataUrl(url)
}

export function loadPriceData(urlPath: string) {
    let url = buildPriceUrl(urlPath)
    let body = loadCacheBustUrl(url)

    let json = JSON.parse(body);

    return json.prices;
}
