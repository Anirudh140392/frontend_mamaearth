import { buildCacheKey, getCache, setCache } from './cacheUtils';

/**
 * Wrapper around fetch with localStorage caching for idempotent GETs.
 *
 * @param {string} url
 * @param {{ method?: string, headers?: HeadersInit, signal?: AbortSignal }} [options]
 * @param {{ ttlMs?: number, cacheKey?: string, bypassCache?: boolean }} [cacheOptions]
 * @returns {Promise<Response>}
 */
export async function cachedFetch(url, options = {}, cacheOptions = {}) {
    const { ttlMs = 5 * 60 * 1000, cacheKey, bypassCache = false } = cacheOptions;
    const method = String(options.method || 'GET').toUpperCase();

    // Only cache GET requests
    const shouldCache = method === 'GET' && ttlMs > 0 && !bypassCache;
    const key = shouldCache ? (cacheKey || buildCacheKey(url, { method, headers: options.headers })) : undefined;

    if (shouldCache && key) {
        const cached = getCache(key);
        if (cached) {
            // Return a synthetic Response from cached JSON
            const body = JSON.stringify(cached);
            return new Response(body, {
                status: 200,
                headers: { 'Content-Type': 'application/json', 'X-Cache-Hit': 'true' }
            });
        }
    }

    const res = await fetch(url, options);
    if (!res.ok) return res;

    if (shouldCache && key) {
        try {
            const data = await res.clone().json();
            setCache(key, data, ttlMs);
        } catch (_) {
            // Non-JSON responses are not cached by this helper
        }
    }
    return res;
}
