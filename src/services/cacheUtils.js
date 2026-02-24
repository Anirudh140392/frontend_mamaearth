// Simple localStorage-based cache with TTL

export const getCache = (key) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return null;
        const { expiresAt, data } = parsed;
        if (typeof expiresAt === "number" && Date.now() < expiresAt) {
            return data;
        }
        // Expired — clean up
        localStorage.removeItem(key);
        return null;
    } catch (e) {
        return null;
    }
};

export const setCache = (key, data, ttlMs) => {
    const write = () => {
        const expiresAt = typeof ttlMs === "number" && ttlMs > 0 ? Date.now() + ttlMs : 0;
        localStorage.setItem(key, JSON.stringify({ expiresAt, data }));
    };
    try {
        write();
    } catch (e) {
        try {
            // Attempt to purge expired entries then retry
            purgeExpiredCacheEntries();
            write();
        } catch (e2) {
            try {
                // As a last resort, drop a few oldest cache entries and retry
                purgeOldestCacheEntries(5);
                write();
            } catch (e3) {
                // Give up silently
            }
        }
    }
};

const stringHash = (value) => {
    try {
        let hash = 0;
        for (let i = 0; i < value.length; i++) {
            const chr = value.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return String(hash);
    } catch (e) {
        return "0";
    }
};

export const deriveHeadersCacheKey = (headers) => {
    try {
        if (!headers) return undefined;
        if (headers instanceof Headers) {
            const auth = headers.get("Authorization") || headers.get("authorization");
            return auth ? `auth:${stringHash(auth)}` : undefined;
        }
        if (typeof headers === "object") {
            const auth = headers["Authorization"] || headers["authorization"];
            return auth ? `auth:${stringHash(auth)}` : undefined;
        }
        return undefined;
    } catch (e) {
        return undefined;
    }
};

export const buildCacheKey = (url, { method = "GET", headers } = {}) => {
    const headersKey = deriveHeadersCacheKey(headers);
    const keyObj = { url, method: String(method).toUpperCase(), headersKey };
    try {
        return "cache:" + btoa(unescape(encodeURIComponent(JSON.stringify(keyObj))));
    } catch (e) {
        // Fallback simple key
        return `cache:${method}:${url}:${headersKey || "_"}`;
    }
};

export const purgeExpiredCacheEntries = () => {
    try {
        const now = Date.now();
        const keys = Object.keys(localStorage).filter((k) => k.startsWith("cache:"));
        for (const k of keys) {
            try {
                const raw = localStorage.getItem(k);
                if (!raw) continue;
                const parsed = JSON.parse(raw);
                if (!parsed || typeof parsed !== "object") continue;
                const { expiresAt } = parsed;
                if (typeof expiresAt === "number" && expiresAt !== 0 && expiresAt <= now) {
                    localStorage.removeItem(k);
                }
            } catch (_) {
                // On parse errors, remove the bad entry
                localStorage.removeItem(k);
            }
        }
    } catch (_) {}
};

export const purgeOldestCacheEntries = (count = 5) => {
    try {
        const entries = [];
        const keys = Object.keys(localStorage).filter((k) => k.startsWith("cache:"));
        for (const k of keys) {
            try {
                const raw = localStorage.getItem(k);
                if (!raw) continue;
                const parsed = JSON.parse(raw);
                const expiresAt = parsed?.expiresAt || 0;
                entries.push({ key: k, expiresAt });
            } catch (_) {
                entries.push({ key: k, expiresAt: 0 });
            }
        }
        entries.sort((a, b) => a.expiresAt - b.expiresAt);
        for (let i = 0; i < Math.min(count, entries.length); i++) {
            localStorage.removeItem(entries[i].key);
        }
    } catch (_) {}
};
