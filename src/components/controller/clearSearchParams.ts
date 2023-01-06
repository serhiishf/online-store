import { parseRequestUrl } from './parseRequestUrl';

export function clearSearchParams(url: URL) {
    Object.keys(parseRequestUrl().search).forEach((key) => {
        if (url.searchParams.has(key)) {
            url.searchParams.delete(key);
        }
    });
}
