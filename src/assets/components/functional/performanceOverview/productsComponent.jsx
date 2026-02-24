import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import '../../../styles/campaignsComponent/campaignsComponent.less';
import overviewContext from "../../../../store/overview/overviewContext";
import { useSearchParams } from "react-router";
import ColumnPercentageDataComponent from "../../common/columnPercentageDataComponent";
import OnePercentageDataComponent from "../../common/onePercentageComponent";
import { Switch, Button, Box, CircularProgress } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert } from "@mui/material";
import NewPercentageDataComponent from "../../common/newPercentageDataComponent";
import { cachedFetch } from "../../../../services/cachedFetch";
import { getCache } from "../../../../services/cacheUtils";

const ProductsComponent = () => {

    const dataContext = useContext(overviewContext)
    const { dateRange, brands, getBrandsData, formatDate } = dataContext

    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");
    const selectedBrand = searchParams.get("brand") || "";
    const [productsData, setProductsData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [updatingProduct, setUpdatingProduct] = useState({});
    const [confirmation, setConfirmation] = useState({ show: false, campaignId: null, currentStatus: null, adGroupId: null, advertisedProductName: null, advertisedFsnId: null, campaignName: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    // Add ref to handle abort controller for API calls
    const abortControllerRef = useRef(null);

    const STATUS_OPTIONS = [
        { value: 1, label: 'Active' },
        { value: 0, label: 'Paused' }
    ]

    const ProductsColumnAmazon = [
        {
            field: "asin",
            headerName: "ASIN",
            minWidth: 200
        },
        {
            field: "product_title",
            headerName: "PRODUCT",
            renderCell: (params) => (
                <a href={params.row.product_url} target="_blank"
                    rel="noopener noreferrer">{params.row.product_title}</a>
            ),
            minWidth: 200
        },
        {
            field: "campaign_name",
            headerName: "CAMPAIGN",
            minWidth: 150,
        },
        {
            field: "ad_group_name",
            headerName: "AD GROUP",
            minWidth: 150,
        },
        {
            field: "spend_x",
            headerName: "SPENDS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.spend_x} percentValue={params.row.spend_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "spend_diff",
            headerName: "SPENDS % CHANGE",
            hideable: false
        },
        {
            field: "sales_x",
            headerName: "SALES",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.sales_x} percentValue={params.row.sales_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "sales_diff",
            headerName: "SALES % CHANGE",
            hideable: false
        },
        {
            field: "impressions_x",
            headerName: "IMPRESSIONS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.impressions_x} percentValue={params.row.impressions_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "clicks_x",
            headerName: "CLICKS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.clicks_x} percentValue={params.row.clicks_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "orders_x",
            headerName: "ORDERS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.orders_x} percentValue={params.row.orders_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "ctr_x",
            headerName: "CTR",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.ctr_x} percentValue={params.row.ctr_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "ctr_diff",
            headerName: "CTR % CHANGE",
            hideable: false
        },
        {
            field: "cpc_x",
            headerName: "CPC",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cpc_x} percentValue={params.row.cpc_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cvr_x",
            headerName: "CVR",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cvr_x} percentValue={params.row.cvr_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "roas_x",
            headerName: "ROAS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.roas_x} percentValue={params.row.roas_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "acos_x",
            headerName: "ACOS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.acos_x} percentValue={params.row.acos_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "aov_x",
            headerName: "AOV",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.aov_x} percentValue={params.row.aov_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
    ];

    const STATUS_MAP = [
        { value: "active", label: "Active" },
        { value: "paused", label: "Paused" },
        { value: "aborted", label: "Aborted" }
    ];

    const ProductsColumnBlinkit = [
        {
            field: "fsn_id",
            headerName: "FSN ID",
            minWidth: 200,
        },
        {
            field: "product_name",
            headerName: "PRODUCT",
            renderCell: (params) => (
                <a href={params.row.page_url} target="_blank"
                    rel="noopener noreferrer">{params.row.product_name}</a>
            ),
            minWidth: 300,
        },
        {
            field: "views",
            headerName: "IMPRESSIONS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.views} percentValue={params.row.views_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "ad_spend",
            headerName: "SPEND",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.ad_spend} percentValue={params.row.ad_spend_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cvr",
            headerName: "CVR",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cvr} percentValue={params.row.cvr_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cpc",
            headerName: "CPC",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cpc} percentValue={params.row.cpc_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "direct_units_sold",
            headerName: "DIRECT ORDERS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.direct_units_sold} percentValue={params.row.direct_units_sold_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "indirect_units_sold",
            headerName: "INDIRECT ORDERS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.indirect_units_sold} percentValue={params.row.indirect_units_sold_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "direct_revenue",
            headerName: "DIRECT REVENUE",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.direct_revenue} percentValue={params.row.direct_revenue_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "indirect_revenue",
            headerName: "INDIRECT REVENUE",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.indirect_revenue} percentValue={params.row.indirect_revenue_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "roi_direct",
            headerName: "DIRECT ROI",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.roi_direct} percentValue={params.row.roi_direct_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
    ];

 const ProductsColumnFlipkart = [
    {
        field: "product_name",
        headerName: "PRODUCT",
        minWidth: 200,
    },

    {
        field: "campaign_name",
        headerName: "CAMPAIGN",
        minWidth: 150,
    },

    {
        field: "views",
        headerName: "IMPRESSIONS",
        minWidth: 150,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.views}
                percentValue={params.row.views_diff}
            />
        ),
    },

    {
        field: "actions",
        headerName: "CLICKS",
        minWidth: 150,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.actions}
                percentValue={params.row.actions_diff}
            />
        ),
    },

    // ❌ CPC not directly available in API
    // (can be calculated if needed = ad_spend / actions)

    {
        field: "ad_spend",
        headerName: "SPENDS",
        minWidth: 150,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.ad_spend}
                percentValue={params.row.ad_spend_diff}
            />
        ),
    },

    {
        field: "direct_units_sold",
        headerName: "ORDERS",
        minWidth: 150,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.direct_units_sold}
                percentValue={params.row.direct_units_sold_diff}
            />
        ),
    },

    {
        field: "direct_revenue",
        headerName: "SALES",
        minWidth: 150,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.direct_revenue}
                percentValue={params.row.direct_revenue_diff}
            />
        ),
    },

    {
        field: "action_rate",
        headerName: "CTR",
        minWidth: 150,
        renderCell: (params) => (
            <NewPercentageDataComponent
                firstValue={params.row.action_rate}
                secValue={params.row.action_rate_diff}
            />
        ),
    },

   

    {
        field: "cvr",
        headerName: "CVR",
        minWidth: 150,
        renderCell: (params) => (
            <NewPercentageDataComponent
                firstValue={params.row.cvr}
                secValue={params.row.cvr_diff}
            />
        ),
    },

    {
        field: "roi_direct",
        headerName: "ROAS",
        minWidth: 150,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.roi_direct}
                percentValue={params.row.roi_direct_diff}
            />
        ),
    },
];

    const ProductsColumnSwiggy = [
        {
            field: "product_name",
            headerName: "PRODUCT",
            minWidth: 200
        },
        {
            field: "campaign_name",
            headerName: "CAMPAIGN",
            minWidth: 150,
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
            field: "spend",
            headerName: "SPENDS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.spend} percentValue={params.row.spend_change} />
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
            field: "ctr",
            headerName: "CTR",
            minWidth: 150,
            renderCell: (params) => (
                <NewPercentageDataComponent firstValue={params.row.ctr} secValue={params.row.ctr_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "ecpm",
            headerName: "CPM",
            minWidth: 150,
            renderCell: (params) => (
                <NewPercentageDataComponent firstValue={params.row.ecpm} secValue={params.row.ecpm_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "ecpc",
            headerName: "CPC",
            minWidth: 150,
            renderCell: (params) => (
                <NewPercentageDataComponent firstValue={params.row.ecpc} secValue={params.row.ecpc_change} />
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
            field: "a2c",
            headerName: "ATC",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.a2c} percentValue={params.row.a2c_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "a2c_rate",
            headerName: "ATC RATE",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.a2c_rate} percentValue={params.row.a2c_rate_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "roi",
            headerName: "ROAS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.roi} percentValue={params.row.roi_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
    ];

    const getProductKey = (advertisedFsnId, adGroupId) => `${advertisedFsnId}_${adGroupId}`;

    const handleToggle = (campaignId, currentStatus, adGroupId, advertisedProductName, advertisedFsnId, campaignName) => {
        setConfirmation({ show: true, campaignId, currentStatus, adGroupId, advertisedProductName, advertisedFsnId, campaignName });
    };

    const updateProductStatus = (advertisedFsnId, adGroupId, newStatus) => {
        setProductsData(prevData => ({
            ...prevData,
            data: prevData.data.map(product =>
                product.advertised_fsn_id === advertisedFsnId && product.ad_group_id === adGroupId
                    ? { ...product, status: newStatus }
                    : product
            )
        }));
    };

    const confirmStatusChange = async () => {
        setConfirmation({ show: false, campaignId: null, currentStatus: null, adGroupId: null, advertisedProductName: null, advertisedFsnId: null, campaignName: null });
        const { campaignId, currentStatus, adGroupId, advertisedProductName, advertisedFsnId, campaignName } = confirmation;
        if (!campaignId) return;
        const productKey = getProductKey(advertisedFsnId, adGroupId);
        setUpdatingProduct(prev => ({ ...prev, [productKey]: true }));

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("No access token found");
            const params = new URLSearchParams({
                campaign_id: campaignId,
                ad_group_id: adGroupId,
                status: currentStatus,
                advertised_product_name: advertisedProductName,
                advertised_fsn_id: advertisedFsnId,
                campaign_name: campaignName
            });
            const url = `https://react-api-script.onrender.com/app/amazon-product-play-pause?${params.toString()}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) throw new Error("Failed to update campaign status");
            updateProductStatus(advertisedFsnId, adGroupId, currentStatus === "SERVICEABLE" ? "PAUSED" : "SERVICEABLE");
            handleSnackbarOpen("Status updated successfully!", "success");
        } catch (error) {
            console.error("Error updating campaign status:", error);
            handleSnackbarOpen("Failed to update status!", "error");
        } finally {
            setUpdatingProduct(prev => {
                const newState = { ...prev };
                delete newState[productKey];
                return newState;
            });
        }
    };

    const getProductsData = async (forceRefresh = false) => {
        if (!operator || operator === "Swiggy" || operator === "Blinkit") return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setProductsData({});
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

        let url = `https://react-api-script.onrender.com/mamaearth/products?start_date=${startDate}&end_date=${endDate}&platform=${operator}${ts}`;
        if (selectedBrand && selectedBrand.trim() !== "") {
            url += `&brand_name=${encodeURIComponent(selectedBrand)}`;
        }
        const cacheKey = `cache:GET:${url}`;

        if (forceRefresh) {
            try { localStorage.removeItem(cacheKey); } catch (_) { }
        } else {
            const cached = getCache(cacheKey);
            if (cached) {
                setProductsData(cached);
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
            setProductsData(data);
            if (forceRefresh) {
                try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch (_) { }
            }
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Previous request aborted due to operator change.");
            } else {
                console.error("Failed to fetch products data:", error.message);
                setProductsData({});
            }
        } finally {
            setIsLoading(false);
        }
    };

    const columns = useMemo(() => {
        if (operator === "Amazon") return ProductsColumnAmazon;
        if (operator === "Flipkart") return ProductsColumnFlipkart;
        if (operator === "Blinkit") return ProductsColumnBlinkit;
        if (operator === "Swiggy") return ProductsColumnSwiggy;
        return [];
    }, [operator, brands]);

    const handleRefresh = () => {
        getProductsData(true);
    };

    // Single useEffect that mirrors OverviewComponent behavior
    useEffect(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const timeout = setTimeout(() => {
            if (localStorage.getItem("accessToken")) {
                // Prevent API call for Swiggy and Blinkit
                if (operator !== "Swiggy" && operator !== "Blinkit") {
                    getProductsData();
                }
            }
        }, 100);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            clearTimeout(timeout);
        }
    }, [operator, dateRange, selectedBrand]); // Include selectedBrand to trigger refresh on brand change

    const handleSnackbarOpen = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <React.Fragment>
            <Dialog open={confirmation.show} onClose={() => setConfirmation({ show: false, campaignId: null, currentStatus: null, adGroupId: null, advertisedProductName: null, advertisedFsnId: null, campaignName: null })}>
                <DialogTitle>Confirm Status Change</DialogTitle>
                <DialogContent>Are you sure you want to change status of this product?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmation({ show: false, campaignId: null, currentStatus: null, adGroupId: null, advertisedProductName: null, advertisedFsnId: null, campaignName: null })}>Cancel</Button>
                    <Button onClick={confirmStatusChange} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
            <div className="shadow-box-con-campaigns aggregated-view-con">
                <div className="px-3 py-2 d-flex justify-content-end">
                    <Button variant="contained" size="small" onClick={handleRefresh}>Refresh</Button>
                </div>
                <div className="datatable-con-campaigns">
                    {isLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <MuiDataTableComponent
                            isLoading={isLoading}
                            isExport={true}
                            columns={columns}
                            data={productsData?.data}
                        />
                    )}
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

export default ProductsComponent;