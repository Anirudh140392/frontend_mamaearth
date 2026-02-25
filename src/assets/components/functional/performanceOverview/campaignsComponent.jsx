import React, { useContext, useState, useEffect, useMemo, useRef, useImperativeHandle, forwardRef } from "react";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import '../../../styles/campaignsComponent/campaignsComponent.less';
import overviewContext from "../../../../store/overview/overviewContext";
import { Switch, Box, Button, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from "@mui/material";
import { useSearchParams } from "react-router";
import ColumnPercentageDataComponent from "../../common/columnPercentageDataComponent";
import TrendsModal from "./modal/trendsModal";
import BudgetCell from "./overview/budgetCell";
import NewPercentageDataComponent from "../../common/newPercentageDataComponent";
import { cachedFetch } from "../../../../services/cachedFetch";
import { getCache, setCache } from "../../../../services/cacheUtils";
import OnePercentageDataComponent from "../../common/onePercentageComponent";
import ValueFormatter from "../../common/valueFormatter";

const CampaignsComponent = (props, ref) => {

    const dataContext = useContext(overviewContext)
    const { dateRange, brands, getBrandsData, formatDate } = dataContext

    const [updatingCampaigns, setUpdatingCampaigns] = useState({});
    const [showTrendsModal, setShowTrendsModal] = useState({ name: '', show: false, date: [] })
    const [campaignsData, setCampaignsData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [confirmation, setConfirmation] = useState({
        show: false,
        campaignId: null,
        campaignType: null,
        adType: null,
        currentStatus: null,
        newStatus: null,
        platform: null,
        brandName: null
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const [searchParams, setSearchParams] = useSearchParams();
    const operator = searchParams.get("operator");
    const selectedBrand = searchParams.get("brand") || "";

    // Add ref to handle abort controller for API calls
    const abortControllerRef = useRef(null);

    // Track if data was mutated (budget/status changed) to force refresh on next component mount
    const dataMutated = useRef(false);

    // Track if component is currently visible/mounted
    const isComponentActive = useRef(true);

    const STATUS_OPTIONS = [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'ON_HOLD', label: 'On Hold' },
        { value: 'STOPPED', label: 'Stopped' }
    ]

    // Utility function to clear all campaign-related caches
    const clearCampaignCaches = () => {
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.includes('/mamaearth/campaign')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            console.log(`Cleared ${keysToRemove.length} campaign cache entries`);
        } catch (error) {
            console.error("Error clearing campaign caches:", error);
        }
    };

    // Helper function to determine if toggle should be "on"
    // ON (true) = ACTIVE or ON_HOLD
    // OFF (false) = STOPPED
    const isStatusActive = (status) => {
        if (!status) return false;
        const statusStr = String(status).toUpperCase().trim();
        return (
            statusStr === "ACTIVE" ||
            statusStr === "ON_HOLD" ||
            statusStr === "TOTAL_BUDGET_MET" ||
            statusStr === "BUDGET_MET" ||
            statusStr === "LIVE"
        );
    };

    const CampaignsColumnFlipkart = [
        {
            field: "campaign_name",
            headerName: "CAMPAIGN",
            minWidth: 200,
            renderCell: (params) => (
                <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5, cursor: "pointer" }}
                    onClick={() =>
                        handleCampaignClick(params.row.campaign_name, params.row.campaign_id)
                    }
                    className="redirect"
                >
                    {params.row.campaign_name}
                </Box>
            ),
        },

        {
            field: "Budget",
            headerName: "BUDGET",
            minWidth: 200,
            renderCell: (params) => (
                <BudgetCell
                    status={params.row.campaign_status}
                    value={params.row.Budget}
                    campaignId={params.row.campaign_id}
                    adType={params.row.ad_type}
                    ad_type_label={params.row.ad_type_label}
                    brand={params.row.brand}
                    endDate={params.row.end_date || null}
                    platform={operator}
                    onUpdate={async (campaignId, newBudget) => {
                        setCampaignsData(prev => ({
                            ...prev,
                            data: prev.data.map(c =>
                                c.campaign_id === campaignId
                                    ? { ...c, Budget: newBudget }
                                    : c
                            )
                        }));
                        await handleRefresh();
                    }}
                    onSnackbarOpen={handleSnackbarOpen}
                />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },

        {
            field: "campaign_status",
            headerName: "STATE",
            minWidth: 240,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => {
                const statusLabel = params.row.campaign_status;

                if (updatingCampaigns[params.row.campaign_id]) {
                    return (
                        <Box sx={{ height: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                            <CircularProgress size={24} />
                        </Box>
                    );
                }

                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Switch
                            checked={isStatusActive(statusLabel)}
                            onChange={() =>
                                handleToggleB(params.row.campaign_id, statusLabel, params.row.ad_type_label)
                            }
                        />
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                            {statusLabel}
                        </Typography>
                    </Box>
                );
            },
            type: "singleSelect",
            valueOptions: STATUS_OPTIONS
        },


        {
            field: "ad_type_label",
            headerName: "CAMPAIGN TYPE",
            minWidth: 155,
        },

        {
            field: "views_y",
            headerName: "IMPRESSIONS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.views_y}
                    percentValue={params.row.views_diff}
                />
            ),
        },

        {
            field: "clicks_y",
            headerName: "CLICKS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.clicks_y}
                    percentValue={params.row.clicks_diff}
                />
            ),
        },

        {
            field: "cpc",
            headerName: "CPC",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.cpc}
                    percentValue={params.row.cpc_diff}
                />
            ),
        },

        {
            field: "cost_y",
            headerName: "SPENDS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.cost_y}
                    percentValue={params.row.cost_diff}
                />
            ),
        },

        {
            field: "total_converted_units_y",
            headerName: "ORDERS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.total_converted_units_y}
                    percentValue={params.row.total_converted_units_diff}
                />
            ),
        },

        {
            field: "total_converted_revenue_y",
            headerName: "SALES",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.total_converted_revenue_y}
                    percentValue={params.row.total_converted_revenue_diff}
                />
            ),
        },

        {
            field: "ctr_y",
            headerName: "CTR",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.ctr_y}
                    percentValue={params.row.ctr_diff}
                />
            ),
        },
        {
            field: "cvr",
            headerName: "CVR",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.cvr}
                    percentValue={params.row.cvr_diff}
                />
            ),
        },

        {
            field: "roi_y",
            headerName: "ROI",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.roi_y}
                    percentValue={params.row.roi_diff}
                />
            ),
        }
    ];
    const CampaignsColumnZepto = [
        {
            field: "campaign_name",
            headerName: "CAMPAIGN",
            minWidth: 200,
            renderCell: (params) => (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Box sx={{ cursor: "pointer" }}>
                        {params.row.campaign_name}
                    </Box>
                </Box>
            ),
        },
        {
            field: "daily_budget",
            headerName: "BUDGET",
            minWidth: 200,
            renderCell: (params) => (
                <BudgetCell
                    value={params.row.daily_budget}
                    campaignId={params.row.campaign_id}
                    platform={operator}
                    brand_name={params.row.brand_name}
                    ad_type_label={params.row.ad_type_label}
                    endDate={params.row.end_date || null}
                    onUpdate={async (campaignId, newBudget) => {
                        console.log("Updating Zepto campaign budget:", campaignId, "New budget:", newBudget);
                        try {
                            // Clear all campaign caches first
                            await new Promise((resolve) => {
                                const keysToRemove = [];
                                for (let i = 0; i < localStorage.length; i++) {
                                    const key = localStorage.key(i);
                                    if (key && key.includes('/mamaearth/campaign')) {
                                        keysToRemove.push(key);
                                    }
                                }
                                keysToRemove.forEach(key => localStorage.removeItem(key));
                                console.log(`Cleared ${keysToRemove.length} campaign cache entries`);
                                resolve();
                            });

                            // Optimistically update local state
                            setCampaignsData(prevData => ({
                                ...prevData,
                                data: prevData.data.map(campaign =>
                                    campaign.campaign_id === campaignId
                                        ? { ...campaign, daily_budget: newBudget }
                                        : campaign
                                )
                            }));

                            // Step 1: Build URL and cache key for refresh
                            const startDate = formatDate(dateRange[0].startDate);
                            const endDate = formatDate(dateRange[0].endDate);
                            const ts = `&_=${Date.now()}`;

                            let url = `https://react-api-script.onrender.com/mamaearth/campaign?start_date=${startDate}&end_date=${endDate}&platform=${operator}${ts}`;
                            if (selectedBrand && selectedBrand.trim() !== "") {
                                url += `&brand_name=${encodeURIComponent(selectedBrand)}`;
                            }

                            const cacheKey = `cache:GET:${url}`;

                            // Step 2: Clear cache asynchronously
                            await new Promise((resolve) => {
                                localStorage.removeItem(cacheKey);
                                resolve();
                            });

                            // Fetch fresh data immediately
                            await handleRefresh();

                            // Show success message

                        } catch (error) {
                            console.error("Error during budget update refresh:", error);
                            handleSnackbarOpen("Failed to refresh after budget update", "error");
                        }
                    }}
                    onSnackbarOpen={handleSnackbarOpen}
                />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "status",
            headerName: "STATE",
            minWidth: 180,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => {
                const status = params.row.status;
                const campaignId = params.row.campaign_id;
                const brandName = params.row.brand_name;

                // Show loading spinner if this campaign is being updated
                if (updatingCampaigns[campaignId]) {
                    return (
                        <Box sx={{ height: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                            <CircularProgress size={24} />
                        </Box>
                    );
                }

                // Disable toggle for ENDED and DAILY_BUDGET_EXHAUSTED
                const isDisabled = status === "ENDED" || status === "DAILY_BUDGET_EXHAUSTED";
                // Toggle ON for ACTIVE, TOTAL_BUDGET_MET, BUDGET_MET, LIVE, etc.
                const isActive = isStatusActive(status);

                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Switch
                            checked={isActive}
                            disabled={isDisabled}
                            onChange={() => {
                                // Show confirmation dialog before changing status
                                // Include currentStatus so the API receives the current state (not the new one)
                                setConfirmation({
                                    show: true,
                                    campaignId,
                                    newStatus: isActive ? "PAUSED" : "ACTIVE",
                                    currentStatus: status,
                                    platform: "Zepto",
                                    brandName
                                });
                            }}
                        />
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                            {status}
                        </Typography>
                    </Box>
                );
            },
            type: "singleSelect",
        },
        {
            field: "impressions",
            headerName: "IMPRESSIONS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.impressions} percentValue={params.row.impressions_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "clicks",
            headerName: "CLICKS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.clicks} percentValue={params.row.clicks_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cpc",
            headerName: "CPC",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cpc} percentValue={params.row.cpc_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },

        {
            field: "spend",
            headerName: "SPENDS",
            minWidth: 170,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.spend} percentValue={params.row.spend_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "orders",
            headerName: "ORDERS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.orders} percentValue={params.row.orders_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "sales",
            headerName: "SALES",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.sales} percentValue={params.row.sales_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cpm",
            headerName: "CPM",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cpm} percentValue={params.row.cpm_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "roas",
            headerName: "ROAS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.roas} percentValue={params.row.roas_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
    ];

    const CampaignsColumnSwiggy = [
        {
            field: "campaign_name",
            headerName: "CAMPAIGN",
            minWidth: 200,
            renderCell: (params) => (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Box sx={{ cursor: "pointer" }}>
                        {params.row.campaign_name}
                    </Box>
                </Box>
            ),
        },
        {
            field: "api_budget",
            headerName: "BUDGET",
            minWidth: 200,
            renderCell: (params) => <BudgetCell
                status={params.row.campaign_status}
                value={params.row.api_budget}
                campaignId={params.row.campaign_id}
                adType={params.row.ad_type}
                ad_type_label={params.row.ad_type_label}
                brand={params.row.brand}
                endDate={params.row.end_date || null}
                platform={operator}
                onUpdate={async (campaignId, newBudget) => {
                    console.log("Updating campaign:", campaignId, "New budget:", newBudget);
                    try {
                        // Clear all campaign caches first
                        await new Promise((resolve) => {
                            const keysToRemove = [];
                            for (let i = 0; i < localStorage.length; i++) {
                                const key = localStorage.key(i);
                                if (key && key.includes('/mamaearth/campaign')) {
                                    keysToRemove.push(key);
                                }
                            }
                            keysToRemove.forEach(key => localStorage.removeItem(key));
                            console.log(`Cleared ${keysToRemove.length} campaign cache entries`);
                            resolve();
                        });

                        // Optimistically update local state
                        setCampaignsData(prevData => ({
                            ...prevData,
                            data: prevData.data.map(campaign =>
                                campaign.campaign_id === campaignId
                                    ? { ...campaign, Budget: newBudget }
                                    : campaign
                            )
                        }));

                        // Step 1: Build URL and cache key for refresh
                        const startDate = formatDate(dateRange[0].startDate);
                        const endDate = formatDate(dateRange[0].endDate);
                        const ts = `&_=${Date.now()}`;

                        let url = `https://react-api-script.onrender.com/mamaearth/campaign?start_date=${startDate}&end_date=${endDate}&platform=${operator}${ts}`;
                        if (selectedBrand && selectedBrand.trim() !== "") {
                            url += `&brand_name=${encodeURIComponent(selectedBrand)}`;
                        }

                        const cacheKey = `cache:GET:${url}`;

                        // Step 2: Clear cache asynchronously
                        await new Promise((resolve) => {
                            localStorage.removeItem(cacheKey);
                            resolve();
                        });

                        // Fetch fresh data immediately
                        await handleRefresh();

                        // Show success message

                    } catch (error) {
                        console.error("Error during budget update refresh:", error);
                        handleSnackbarOpen("Failed to refresh after budget update", "error");
                    }
                }}
                onSnackbarOpen={handleSnackbarOpen}
            />,
            headerAlign: "left",
            type: "number",
            align: "left",
        },
        {
            field: "final_status",
            headerName: "STATE",
            minWidth: 180,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => {
                const status = params.row.final_status;

                if (updatingCampaigns[params.row.campaign_id]) {
                    return (
                        <Box sx={{ height: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                            <CircularProgress size={24} />
                        </Box>
                    );
                }

                // Toggle is ON for ACTIVE or ON_HOLD
                // Toggle is OFF for STOPPED
                const isActive = isStatusActive(status);

                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Switch
                            checked={isActive}
                            onChange={() => handleToggle(
                                params.row.campaign_id,
                                status,
                                params.row.ad_type_label
                            )}
                        />
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                            {status}
                        </Typography>
                    </Box>
                );
            },
            type: "singleSelect",
            valueOptions: STATUS_OPTIONS
        },
        {
            field: "impressions",
            headerName: "IMPRESSIONS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.impressions} percentValue={params.row.impressions_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "clicks",
            headerName: "CLICKS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.clicks} percentValue={params.row.clicks_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cpc",
            headerName: "CPC",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cpc} percentValue={params.row.cpc_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "spend",
            headerName: "SPENDS",
            minWidth: 170,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.spend} percentValue={params.row.spend_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "orders",
            headerName: "ORDERS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.orders} percentValue={params.row.orders_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "revenue",
            headerName: "SALES",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.revenue} percentValue={params.row.revenue_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cpm",
            headerName: "CPM",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cpm} percentValue={params.row.cpm_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "roas",
            headerName: "ROAS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.roas} percentValue={params.row.roas_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
    ];


    const normalizedBrands = useMemo(() => {
        const source = brands;
        if (!source) return [];
        if (Array.isArray(source)) {
            if (source.length === 0) return [];
            if (typeof source[0] === "string") return source;
            return source
                .map((item) => item?.brand_name || item?.brand || item?.name)
                .filter(Boolean);
        }
        if (Array.isArray(source?.data)) {
            const arr = source.data;
            if (arr.length === 0) return [];
            if (typeof arr[0] === "string") return arr;
            return arr
                .map((item) => item?.brand_name || item?.brand || item?.name)
                .filter(Boolean);
        }
        return [];
    }, [brands]);

    const getCampaignsData = async (forceRefresh = false) => {
        if (!operator) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setCampaignsData({});
        setIsLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("No access token found");
            setIsLoading(false);
            return;
        }

        const startDate = formatDate(dateRange[0].startDate);
        const endDate = formatDate(dateRange[0].endDate);

        try {
            const ts = forceRefresh ? `&_=${Date.now()}` : "";
            let url = `https://react-api-script.onrender.com/mamaearth/campaign?start_date=${startDate}&end_date=${endDate}&platform=${operator}${ts}`;
            if (selectedBrand && selectedBrand.trim() !== "") {
                url += `&brand_name=${encodeURIComponent(selectedBrand)}`;
            }
            const cacheKey = `cache:GET:${url}`;

            if (forceRefresh) {
                try { localStorage.removeItem(cacheKey); } catch (_) { }
            } else {
                const cached = getCache(cacheKey);
                if (cached) {
                    setCampaignsData(cached);
                    setIsLoading(false);
                    return;
                }
            }

            const response = await cachedFetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                signal: controller.signal,
            }, { ttlMs: 5 * 60 * 1000, cacheKey, bypassCache: forceRefresh });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Campaigns data fetched:", data);
            setCampaignsData(data);
            if (forceRefresh) {
                try { setCache(cacheKey, data, 5 * 60 * 1000); } catch (_) { }
            }
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Previous request aborted due to operator change.");
            } else {
                console.error("Failed to fetch campaigns data:", error.message);
                setCampaignsData({});
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async (keepData = true) => {
        try {
            // Only set loading if we're not keeping existing data
            if (!keepData) {
                setIsLoading(true);
            }

            // Build URL and cache key
            const startDate = formatDate(dateRange[0].startDate);
            const endDate = formatDate(dateRange[0].endDate);
            const ts = `&_=${Date.now()}`;

            let url = `https://react-api-script.onrender.com/mamaearth/campaign?start_date=${startDate}&end_date=${endDate}&platform=${operator}${ts}`;
            if (selectedBrand && selectedBrand.trim() !== "") {
                url += `&brand_name=${encodeURIComponent(selectedBrand)}`;
            }

            // Clear old cache asynchronously
            await new Promise((resolve) => {
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.includes('/mamaearth/campaign')) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));
                resolve();
            });

            // Fetch new data
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("Missing access token");

            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to refresh: ${response.statusText}`);
            }

            const freshData = await response.json();

            // Step 3: Update state with new data
            setCampaignsData(freshData);

            // Step 4: Optionally re-cache fresh data
            try {
                localStorage.setItem(cacheKey, JSON.stringify(freshData));
            } catch (err) {
                console.warn("Could not re-cache fresh data:", err);
            }



        } catch (error) {
            console.error("Error during refresh:", error);
            handleSnackbarOpen("Failed to refresh data", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        refresh: handleRefresh
    }));

    // Effect to handle component mount and parameter changes
    useEffect(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Mark component as active when this effect runs
        isComponentActive.current = true;

        const timeout = setTimeout(() => {
            if (localStorage.getItem("accessToken")) {
                // Check if we're returning to component after a mutation happened
                if (dataMutated.current && isComponentActive.current) {
                    console.log("Component switched back after mutation, fetching fresh data");
                    clearCampaignCaches();
                    getCampaignsData(true);
                    dataMutated.current = false; // Reset the flag after fetching
                } else {
                    console.log("Normal navigation, using cache if available");
                    getCampaignsData(false); // Use cache
                }
            }
        }, 100);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            clearTimeout(timeout);
            // Mark component as inactive when unmounting
            isComponentActive.current = false;
        }
    }, [operator, dateRange, selectedBrand]);

    // Component lifecycle tracking - detect when component becomes visible again
    useEffect(() => {
        // Component is mounting/becoming visible
        isComponentActive.current = true;

        return () => {
            // Component is unmounting/becoming hidden
            isComponentActive.current = false;
        };
    }, []);

    useEffect(() => {
        try { getBrandsData(); } catch (_) { }
    }, [operator]);

    const columns = useMemo(() => {
        if (operator === "Flipkart") return CampaignsColumnFlipkart;
        if (operator === "Zepto") return CampaignsColumnZepto;
        if (operator === "Swiggy") return CampaignsColumnSwiggy;
        return [];
    }, [operator, brands, updatingCampaigns]);

    const handleCampaignClick = async (campaignName, campaignId) => {
        try {
            const token = localStorage.getItem("accessToken");
            const startDate = formatDate(dateRange[0].startDate);
            const endDate = formatDate(dateRange[0].endDate);
            let url = `https://react-api-script.onrender.com/mamaearth/campaign_graph?start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&platform=${operator}&campaign_id=${campaignId}`;
            if (selectedBrand && selectedBrand.trim() !== "") {
                url += `&brand_name=${encodeURIComponent(selectedBrand)}`;
            }
            const cacheKey = `cache:GET:${url}`;

            const cached = getCache(cacheKey);
            if (cached) {
                setShowTrendsModal({ name: campaignName, show: true, data: cached });
                return;
            }

            const response = await cachedFetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }, { ttlMs: 5 * 60 * 1000, cacheKey });
            const data = await response.json()
            if (response.ok) {
                setShowTrendsModal({ name: campaignName, show: true, data: data });
            } else {
                console.error("Failed to fetch campaign data");
            }
        } catch (error) {
            console.error("Error fetching campaign data", error);
        }
    };

    const handleToggle = (campaignId, currentStatus, ad_type_label) => {
        console.log('currentStatus', currentStatus)
        // Determine new status based on current status
        const statusStr = String(currentStatus).toUpperCase().trim();
        console.log("Toggling campaign:", campaignId, "Current status:", statusStr, "Ad Type:", ad_type_label);
        let newStatus;

        if (statusStr === 'ACTIVE' || statusStr === 'ON_HOLD') {
            newStatus = 'STOPPED';
        } else {
            newStatus = 'ACTIVE';
        }

        setConfirmation({
            show: true,
            campaignId,
            campaignType: statusStr,
            adType: ad_type_label,
            currentStatus,
            platform: operator
        });
    };

    const handleToggleB = (campaignId, currentStatus, ad_type_label) => {
        console.log('currentStatus', currentStatus)
        // Determine new status based on current status
        const statusStr = String(currentStatus).toUpperCase().trim();
        console.log("Toggling campaign:", campaignId, "Current status:", statusStr, "Ad Type:", ad_type_label);
        let newStatus;

        if (statusStr === 'ACTIVE' || statusStr === 'ON_HOLD') {
            newStatus = 'STOP';
        } else {
            newStatus = 'START';
        }

        setConfirmation({
            show: true,
            campaignId,
            campaignType: statusStr,
            adType: ad_type_label,
            currentStatus,
            platform: operator
        });
    };

    const updateCampaignStatus = (campaignId, newStatus, ad_type_label) => {
        setConfirmation({ show: false, campaignId: null, campaignType: null, ad_type_label: null, currentStatus: null });
        setUpdatingCampaigns(prev => ({ ...prev, [campaignId]: true }));
        confirmStatusChange(campaignId, newStatus, ad_type_label);
    };

    const confirmStatusChange = async (campaignId, newStatus, ad_type_label) => {
        try {

            // Set loading state for this campaign
            setUpdatingCampaigns(prev => ({ ...prev, [campaignId]: true }));

            const token = localStorage.getItem("accessToken");

            // Determine action based on new status
            const action = (newStatus === 'ACTIVE' || newStatus === 'ON_HOLD') ? 'PAUSE' : 'START';

            const requestBody = {
                platform: operator,
                ad_type: ad_type_label,
                campaign_id: campaignId,
            };

            // Build the URL with platform as query parameter (lowercase)
            const platformLower = operator.toLowerCase();
            const playPauseUrl = `https://react-api-script.onrender.com/mamaearth/campaign-play-pause?platform=${platformLower}`;

            console.log("Sending play-pause request:", requestBody);

            const response = await fetch(playPauseUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Failed to update campaign status: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Campaign status updated successfully", data);

            // Determine the new status to update locally
            const updatedNewStatus = action === 'START' ? 'ACTIVE' : 'STOPPED';

            // Step 1: Immediately update local state with optimistic UI update (toggle switches immediately)
            setCampaignsData(prevData => ({
                ...prevData,
                data: prevData.data.map(campaign =>
                    campaign.campaign_id === campaignId
                        ? { ...campaign, status: updatedNewStatus }
                        : campaign
                )
            }));

            // Step 2: Build URL and cache key for refresh
            const startDate = formatDate(dateRange[0].startDate);
            const endDate = formatDate(dateRange[0].endDate);
            const ts = `&_=${Date.now()}`;

            let url = `https://react-api-script.onrender.com/mamaearth/campaign?start_date=${startDate}&end_date=${endDate}&platform=${operator}${ts}`;
            if (selectedBrand && selectedBrand.trim() !== "") {
                url += `&brand_name=${encodeURIComponent(selectedBrand)}`;
            }

            const cacheKey = `cache:GET:${url}`;

            // Step 3: Clear cache asynchronously
            await new Promise((resolve) => {
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.includes('/mamaearth/campaign')) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));
                resolve();
            });

            // Step 4: Fetch fresh data
            const freshResponse = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!freshResponse.ok) {
                throw new Error(`Failed to refresh after status update: ${freshResponse.statusText}`);
            }

            const freshData = await freshResponse.json();

            // Step 4: Update state with fresh data
            setCampaignsData(freshData);

            // Show success message
            handleSnackbarOpen(data.message || "Campaign status updated successfully!", "success");

            // Step 5: Handle warning if present in response
            if (data.warning && data.warning.message) {
                // Show warning message after a short delay so it doesn't get hidden by success message
                setTimeout(() => {
                    const warningMessage = `⚠️ ${data.warning.message}\n\n💡 ${data.warning.recommendation || ''}`.trim();
                    handleSnackbarOpen(warningMessage, "warning");
                }, 1500);
            }

            // Remove loading state for this specific campaign
            setUpdatingCampaigns(prev => ({ ...prev, [campaignId]: false }));

        } catch (error) {
            console.error("Error updating campaign status:", error);
            handleSnackbarOpen("Error updating campaign status", "error");
            setUpdatingCampaigns(prev => ({ ...prev, [campaignId]: false }));

            // On error, revert the UI by fetching fresh data
            clearCampaignCaches();
            setTimeout(() => getCampaignsData(true), 500);
        }
    };

    const handleSnackbarOpen = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <React.Fragment>
            {/* Dialog for Zepto status changes */}
            {confirmation.show && confirmation.platform === "Zepto" && (
                <Dialog open={true} onClose={() => setConfirmation({ show: false })}>
                    <DialogTitle>Confirm Status Change</DialogTitle>
                    <DialogContent>
                        Are you sure you want to change status to {confirmation.newStatus}?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmation({ show: false })}>Cancel</Button>
                        <Button color="primary" onClick={async () => {
                            const { campaignId, newStatus, currentStatus, brandName } = confirmation;
                            setUpdatingCampaigns(prev => ({ ...prev, [campaignId]: true }));
                            try {
                                const token = localStorage.getItem("accessToken");
                                // Build payload as required - send currentStatus for Zepto instead of the new status
                                const payload = {
                                    campaign_id: campaignId,
                                    status: currentStatus,
                                    platform: "zepto",
                                    brand_name: brandName
                                };

                                console.log("Sending Zepto play-pause request:", payload);

                                const response = await fetch("https://react-api-script.onrender.com/mamaearth/campaign-play-pause", {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify(payload)
                                });

                                if (response.ok) {
                                    const data = await response.json();
                                    handleSnackbarOpen(data.message || "Status updated successfully!", "success");
                                    // Step 1: Build URL and cache key for refresh
                                    const startDate = formatDate(dateRange[0].startDate);
                                    const endDate = formatDate(dateRange[0].endDate);
                                    const ts = `&_=${Date.now()}`;

                                    let url = `https://react-api-script.onrender.com/mamaearth/campaign?start_date=${startDate}&end_date=${endDate}&platform=${operator}${ts}`;
                                    if (selectedBrand && selectedBrand.trim() !== "") {
                                        url += `&brand_name=${encodeURIComponent(selectedBrand)}`;
                                    }

                                    const cacheKey = `cache:GET:${url}`;

                                    // Step 2: Clear cache asynchronously
                                    await new Promise((resolve) => {
                                        localStorage.removeItem(cacheKey);
                                        resolve();
                                    });

                                    // Step 3: Fetch fresh data
                                    const freshResponse = await fetch(url, {
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${token}`,
                                        },
                                    });

                                    if (!freshResponse.ok) {
                                        throw new Error(`Failed to refresh after status update: ${freshResponse.statusText}`);
                                    }

                                    const freshData = await freshResponse.json();

                                    // Step 4: Update state with fresh data
                                    setCampaignsData(freshData);

                                    // Step 5: Optionally re-cache fresh data
                                    try {
                                        localStorage.setItem(cacheKey, JSON.stringify(freshData));
                                    } catch (err) {
                                        console.warn("Could not re-cache fresh data:", err);
                                    }
                                } else {
                                    handleSnackbarOpen("Failed to update status!", "error");
                                }
                            } catch (error) {
                                console.error("Error updating Zepto status:", error);
                                handleSnackbarOpen("Error updating status!", "error");
                            } finally {
                                setUpdatingCampaigns(prev => ({ ...prev, [campaignId]: false }));
                                setConfirmation({ show: false });
                            }
                        }}>Confirm</Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Dialog for Flipkart status changes */}
            {confirmation.show && confirmation.platform !== "Zepto" && (
                <Dialog open={true} onClose={() => setConfirmation({ show: false, campaignId: null, campaignType: null, adType: null, currentStatus: null })}>
                    <DialogTitle>Confirm Status Change</DialogTitle>
                    <DialogContent>
                        Are you sure you want to {confirmation.campaignType === 'ACTIVE' ? 'stop' : 'start'} this campaign?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmation({ show: false, campaignId: null, campaignType: null, adType: null, currentStatus: null })}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => updateCampaignStatus(confirmation.campaignId, confirmation.campaignType, confirmation.adType)}
                            color="primary"
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <TrendsModal
                showTrendsModal={showTrendsModal}
                setShowTrendsModal={setShowTrendsModal} />
            <div className="shadow-box-con-campaigns aggregated-view-con">
                <div className="datatable-con-campaigns">
                    <MuiDataTableComponent
                        isLoading={isLoading}
                        isExport={true}
                        columns={columns}
                        data={campaignsData.data || []} />
                </div>
            </div>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </React.Fragment>
    )
}

export default forwardRef(CampaignsComponent);