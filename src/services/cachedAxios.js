import axios from 'axios';
import { buildCacheKey, getCache, setCache } from './cacheUtils';

/**
 * Axios GET with localStorage caching based on URL + Authorization header.
 * Returns a normal axios-like response object.
 */
export async function cachedAxiosGet(url, config = {}, cacheOptions = {}) {
    const { ttlMs = 5 * 60 * 1000, cacheKey, bypassCache = false } = cacheOptions;
    const method = 'GET';
    const shouldCache = ttlMs > 0 && !bypassCache;
    const key = shouldCache ? (cacheKey || buildCacheKey(url, { method, headers: config?.headers })) : undefined;

    if (shouldCache && key) {
        const cached = getCache(key);
        if (cached) {
            return { data: cached, status: 200, statusText: 'OK', headers: {}, config };
        }
    }

    const res = await axios.get(url, config);
    if (shouldCache && key) {
        setCache(key, res.data, ttlMs);
    }
    return res;
}
