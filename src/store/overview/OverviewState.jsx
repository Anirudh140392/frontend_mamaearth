// Header.js - Update this line
// Change: const [selectedBrand, setSelectedBrand] = useState(brandType || "mamaearth Cosmetics");
// To: const [selectedBrand, setSelectedBrand] = useState(brandType || "");

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import OverviewContext from "./overviewContext";
import { subDays, format } from "date-fns";
import { useSearchParams } from "react-router";
import { cachedFetch } from "../../services/cachedFetch";
import { getCache } from "../../services/cacheUtils";

const OverviewState = (props) => {
    const host = "https://react-api-script.onrender.com"

    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");
    // Get selectedBrand from URL params - default to empty string instead of "mamaearth Cosmetics"
    const selectedBrand = searchParams.get("brand") || "mamaearth";

    const [dateRange, setDateRange] = useState([
        {
            startDate: subDays(new Date(), 7),
            endDate: subDays(new Date(), 1),
            key: "selection",
        },
    ]);

    const formatDate = useCallback((date) => format(date, "yyyy-MM-dd"), []);

    const [overviewData, setOverviewData] = useState({})
    const [brands, setBrands] = useState({})

    const [campaignName, setCampaignName] = useState("")
    const [overviewLoading, setOverviewLoading] = useState(false);

    // Track if API call is in progress to prevent duplicate calls
    const apiCallInProgress = useRef(false);

    const campaignSetter = useCallback((value) => {
        setCampaignName(value)
    }, []);

    const fetchAPI = async (endpoint, setLoadingState) => {
        if (!operator) return;
        setLoadingState(true)
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("No access token found");
            setLoadingState(false);
            return;
        }

        const startDate = formatDate(dateRange[0].startDate);
        const endDate = formatDate(dateRange[0].endDate);

        try {
            let url = `${host}/mamaearth/new-overview?start_date=${startDate}&end_date=${endDate}&platform=${operator}`;
            // Only add brand_name parameter if a specific brand is selected (not empty string)
            if (selectedBrand && selectedBrand.trim() !== "") {
                url += `&brand_name=${encodeURIComponent(selectedBrand)}`;
            }
            const cacheKey = `cache:GET:${url}`;

            const cached = getCache(cacheKey);
            if (cached) {
                setLoadingState(false)
                return cached;
            }

            const response = await cachedFetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }, { ttlMs: 5 * 60 * 1000, cacheKey });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Failed to fetch ${endpoint} data:`, error.message);
            return null;
        } finally {
            setLoadingState(false)
        }
    };

    const fetchBrandsAPI = async () => {
        if (!operator) return;
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("No access token found");
            return;
        }

        try {
            const url = `${host}/app/brand-name?platform=${operator}`;
            const cacheKey = `cache:GET:${url}`;

            const cached = getCache(cacheKey);
            if (cached) {
                return cached;
            }

            const response = await cachedFetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }, { ttlMs: 60 * 60 * 1000, cacheKey });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Failed to fetch brand data:`, error.message);
            return null;
        }
    };

    const getBrandsData = useCallback(async () => {
        const data = await fetchBrandsAPI();
        if (data) setBrands(data);
    }, [operator]);

    const getOverviewData = useCallback(async (forceRefresh = false) => {
        if (!operator) return;

        // Prevent duplicate calls
        if (apiCallInProgress.current && !forceRefresh) {
            return;
        }

        apiCallInProgress.current = true;
        setOverviewLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("No access token found");
            setOverviewLoading(false);
            apiCallInProgress.current = false;
            return;
        }

        const startDate = formatDate(dateRange[0].startDate);
        const endDate = formatDate(dateRange[0].endDate);
        const ts = forceRefresh ? `&_=${Date.now()}` : "";

        let url = `${host}/mamaearth/new-overview?start_date=${startDate}&end_date=${endDate}&platform=${operator}${ts}`;
        // Only add brand_name parameter if a specific brand is selected (not empty string)
        if (selectedBrand && selectedBrand.trim() !== "") {
            url += `&brand_name=${encodeURIComponent(selectedBrand)}`;
        }
        const cacheKey = `cache:GET:${url}`;

        try {
            if (forceRefresh) {
                try { localStorage.removeItem(cacheKey); } catch (_) { }
            } else {
                const cached = getCache(cacheKey);
                if (cached) {
                    setOverviewData(cached);
                    setOverviewLoading(false);
                    apiCallInProgress.current = false;
                    return;
                }
            }

            const response = await cachedFetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }, { ttlMs: 5 * 60 * 1000, cacheKey, bypassCache: forceRefresh });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setOverviewData(data);
            if (forceRefresh) {
                try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch (_) { }
            }
        } catch (error) {
            console.error("Failed to fetch overview data:", error.message);
            setOverviewData({});
        } finally {
            setOverviewLoading(false);
            apiCallInProgress.current = false;
        }
    }, [dateRange, operator, selectedBrand, formatDate]);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refreshAll = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
        getOverviewData(true);
    }, [getOverviewData]);

    useEffect(() => {
        setCampaignName("")
    }, [operator])

    const contextValue = useMemo(
        () => ({
            dateRange,
            setDateRange,
            overviewData,
            getOverviewData,
            getBrandsData,
            campaignSetter,
            overviewLoading,
            formatDate,
            brands,
            campaignName,
            selectedBrand,
            refreshTrigger,
            refreshAll
        }),
        [dateRange, overviewData, overviewLoading, campaignName, brands, selectedBrand, getOverviewData, getBrandsData, campaignSetter, formatDate, refreshTrigger, refreshAll]
    );

    return (
        <OverviewContext.Provider value={contextValue}>
            {props.children}
        </OverviewContext.Provider>
    )
}

export default OverviewState;