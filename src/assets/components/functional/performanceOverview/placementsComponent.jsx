import React, { useEffect, useContext, useState, useMemo, useRef } from "react";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import '../../../styles/keywordsComponent/keywordsComponent.less';
import { Typography, Snackbar, Alert, Button, Box, CircularProgress } from "@mui/material";
import overviewContext from "../../../../store/overview/overviewContext";
import { useSearchParams, useNavigate } from "react-router";
import ColumnPercentageDataComponent from "../../common/columnPercentageDataComponent";
import TrendsModal from "./modal/trendsModal";
import BidCell from "./overview/bidCell";
import { cachedFetch } from "../../../../services/cachedFetch";
import { getCache } from "../../../../services/cacheUtils";
import NewPercentageDataComponent from "../../common/newPercentageDataComponent";

const PlacementsComponent = () => {

    const { dateRange, getBrandsData, brands, formatDate, campaignName } = useContext(overviewContext);

    const [showTrendsModal, setShowTrendsModal] = useState({ name: '', show: false, date: [] });
    const [placementData, setPlacementData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");
    const selectedBrand = searchParams.get("brand") || "mamaearth Cosmetics";
    const navigate = useNavigate();

    // Add ref to handle abort controller for API calls
    const abortControllerRef = useRef(null);

    // Brand account combinations
    const accountCombinations = [
        { "brand": "Quench Botanics" },
        { "brand": "mamaearth Cosmetics" },
        { "brand": "mamaearth POP" }

    ];

    // Get unique brands for dropdown
    const uniqueBrands = useMemo(() => {
        const brands = [...new Set(accountCombinations.map(combo => combo.brand))];
        return brands.sort();
    }, []);

    const getPlacementData = async (forceRefresh = false) => {
        if (!operator) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setPlacementData({});
        setIsLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("No access token found");
            setIsLoading(false);
            return;
        }

        const startDate = formatDate(dateRange[0].startDate);
        const endDate = formatDate(dateRange[0].endDate);
        const ts = forceRefresh ? `&_=${Date.now()}` : "";

        let url = `https://react-api-script.onrender.com/mamaearth/placement-page?start_date=${startDate}&end_date=${endDate}&platform=${operator}${ts}`;
        if (selectedBrand && typeof selectedBrand === "string") {
            url += `&brand_name=${encodeURIComponent(selectedBrand)}`;
        }
        const cacheKey = `cache:GET:${url}`;

        if (forceRefresh) {
            try { localStorage.removeItem(cacheKey); } catch (_) { }
        } else {
            const cached = getCache(cacheKey);
            if (cached) {
                setPlacementData(cached);
                setIsLoading(false);
                return;
            }
        }

        try {
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
            setPlacementData(data);
            if (forceRefresh) {
                try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch (_) { }
            }
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Previous request aborted due to operator change.");
            } else {
                console.error("Failed to fetch placement data:", error.message);
                setPlacementData({});
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        getPlacementData(true);
    };

    const handleBidUpdate = async (campaignId, updatedPlacement, newBid) => {
        console.log('Updating placement bid locally:', { campaignId, placement: updatedPlacement, newBid });
        setPlacementData(prevData => {
            if (!prevData.data) return prevData;
            return {
                ...prevData,
                data: prevData.data.map(row => {
                    if (row.campaign_id === campaignId && row.placement_type === updatedPlacement) {
                        return { ...row, bid: newBid };
                    }
                    return row;
                })
            };
        });
    };

    // Single useEffect that mirrors OverviewComponent behavior
    useEffect(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const timeout = setTimeout(() => {
            if (localStorage.getItem("accessToken")) {
                getPlacementData();
            }
        }, 100);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            clearTimeout(timeout);
        }
    }, [operator, dateRange, selectedBrand]); // Include selectedBrand to force refresh on brand change

    useEffect(() => {
        getBrandsData();
    }, [operator]);

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
            window.location.reload();
        }
    }, []);

    const PlacementColumns = [
        {
            field: "placement_type",
            headerName: "PLACEMENT TYPE",
            minWidth: 200,
            renderCell: (params) => (
                <div className="text-icon-div cursor-pointer">
                    <Typography className="redirect" variant="body2">{params.row.placement_type}</Typography>
                </div>
            ),
        },
        {
            field: "bid",
            headerName: "BID",
            minWidth: 150,
            renderCell: (params) => (
                <BidCell
                    value={params.row.bid}
                    campaignId={params.row.campaign_id}
                    campaignType={params.row.type}
                    keyword={params.row.placement_type}
                    keywordType={null}
                    platform={operator}
                    brand_name={params.row.brand_name}
                    onUpdate={handleBidUpdate}
                    onSnackbarOpen={handleSnackbarOpen}
                />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "impressions",
            headerName: "IMPRESSIONS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.impressions} percentValue={params.row.impressions_change} />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "clicks",
            headerName: "CLICKS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.clicks} percentValue={params.row.clicks_change} />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "spend",
            headerName: "SPENDS",
            minWidth: 170,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.spend} percentValue={params.row.spend_change} />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "orders",
            headerName: "ORDERS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.orders} percentValue={params.row.orders_change} />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "revenue",
            headerName: "SALES",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.revenue} percentValue={params.row.revenue_change} />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "cpc",
            headerName: "CPC",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cpc} percentValue={params.row.cpc_change} />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "cpm",
            headerName: "CPM",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cpm} percentValue={params.row.cpm_change} />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "ctr",
            headerName: "CTR",
            minWidth: 150,
            renderCell: (params) => (
                <NewPercentageDataComponent firstValue={params.row.ctr} secValue={params.row.ctr_change} />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "cvr",
            headerName: "CVR",
            minWidth: 150,
            renderCell: (params) => (
                <NewPercentageDataComponent firstValue={params.row.cvr} secValue={params.row.cvr_change} />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "aov",
            headerName: "AOV",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.aov} percentValue={params.row.aov_change} />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "roas",
            headerName: "ROAS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.roas} percentValue={params.row.roas_change} />
            ),
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "campaign_name",
            headerName: "CAMPAIGN",
            minWidth: 300,
        },
        {
            field: "ad_group_id",
            headerName: "AD GROUP ID",
            minWidth: 200,
            align: "left",
            headerAlign: "left",
        },
    ];

    const columns = useMemo(() => {
        return PlacementColumns;
    }, [operator, brands]);

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSnackbarOpen = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    return (
        <React.Fragment>
            <TrendsModal
                showTrendsModal={showTrendsModal}
                setShowTrendsModal={setShowTrendsModal}
            />
            <div className="shadow-box-con-keywords aggregated-view-con">
                <div className="datatable-con-keywords">
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                        <Button variant="outlined" size="small" onClick={handleRefresh}>
                            Refresh
                        </Button>
                    </Box>

                    {isLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <MuiDataTableComponent
                            isLoading={isLoading}
                            isExport={true}
                            columns={columns}
                            data={placementData.data || []}
                        />
                    )}
                </div>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
};

export default PlacementsComponent;