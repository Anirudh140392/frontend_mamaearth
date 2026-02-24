import React, { useEffect, useContext, useState, useRef,useMemo } from "react";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import '../../../styles/keywordsComponent/keywordsComponent.less';
import { Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import overviewContext from "../../../../store/overview/overviewContext";
import { useSearchParams } from "react-router";
import ColumnPercentageDataComponent from "../../common/columnPercentageDataComponent";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { cachedFetch } from "../../../../services/cachedFetch";
import { getCache, setCache } from "../../../../services/cacheUtils";
const SuggestedKeywordsDatatable = () => {

    const { dateRange, formatDate } = useContext(overviewContext)

    const [keywordsData, setKeywordsData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [loadingRows, setLoadingRows] = useState({});

    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");

    const getKeywordsData = async () => {
        if (!operator) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setKeywordsData({});
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
            const url = `https://react-api-script.onrender.com/mamaearth/negative_keywords?start_date=${startDate}&end_date=${endDate}&platform=${operator}`;
            const cacheKey = `cache:GET:${url}`;

            // Check cache first
            const cached = getCache(cacheKey);
            if (cached) {
                setKeywordsData(cached);
                setIsLoading(false);
                return;
            }

           

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setKeywordsData(data);
            
            // Cache the response with 5 minutes TTL
            setCache(cacheKey, data, 5 * 60 * 1000);
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Previous request aborted due to operator change.");
            } else {
                console.error("Failed to fetch keywords data:", error.message);
                setKeywordsData({});
            }
        } finally {
            setIsLoading(false);
        }
    };

    const abortControllerRef = useRef(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            getKeywordsData();
        }, 100);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            clearTimeout(timeout);
        }
    }, [operator, dateRange]);

    const handleAddNegativeKeyword = async (row) => {
        const token = localStorage.getItem("accessToken");
        const uniqueKey = row.campaign_id + row.campaign_type + row.keyword_id + row.ad_group_id;

        if (!token) {
            handleSnackbarOpen("Access token missing", "error");
            return;
        }

        setLoadingRows(prev => ({ ...prev, [uniqueKey]: true }));

        const params = new URLSearchParams({
            platform: operator,
            campaign_id: row.campaign_id,
            campaign_type: row.campaign_type,
            keyword_id: row.keyword_id,
            ad_group_id: row.ad_group_id,
        });

       try {
    const url = `https://react-api-script.onrender.com/mamaearth/add-negative-keyword`;
    const cacheKey = `cache:POST:${url}:${params.toString()}`; // Adjusted for POST caching
    const cached = getCache(cacheKey);

    if (cached) {
        setKeywordsData(cached);
        setIsLoading(false);
        return;
    }

    const response = await cachedFetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(Object.fromEntries(params)), // Convert URLSearchParams to JSON object
        signal: controller.signal,
    }, { ttlMs: 5 * 60 * 1000, cacheKey });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    setKeywordsData(data);
    setIsLoading(false);
    
} catch (error) {
    console.error("API error:", error);
    setIsLoading(false);
}


           
        finally {
            setLoadingRows(prev => {
                const updated = { ...prev };
                delete updated[uniqueKey];
                return updated;
            });
        }
    };

    const SuggestedKeywordsColumnAmazon = [
        {
            field: "keyword",
            headerName: "SEARCH TERM",
            minWidth: 150,
            renderCell: (params) => (
                <div className="text-icon-div cursor-pointer redirect" onClick={() => handleKeywordClick(params.row.keyword, params.row.campaign_id)}>
                    <Typography variant="body2">{params.row.keyword}</Typography>
                </div>
            ),
        },
        {
            field: "add_negative",
            headerName: "ADD NEGATIVE",
            minWidth: 150,
            renderCell: (params) => {
                const uniqueKey = params.row.campaign_id + params.row.campaign_type + params.row.keyword_id + params.row.ad_group_id;
                const isLoading = loadingRows[uniqueKey];

                return (
                    <div className="cursor-pointer">
                        {isLoading ? (
                            <CircularProgress size={20} />
                        ) : (
                            <AddCircleOutlineIcon color="error" onClick={() => handleAddNegativeKeyword(params.row)} />
                        )}
                    </div>
                );
            },
            align: "center"
        },
        {
            field: "ad_group_name",
            headerName: "AD GROUP",
            minWidth: 150,
        },
        { field: "ad_type", headerName: "AD TYPE", minWidth: 150 },
        {
            field: "campaign_name",
            headerName: "CAMPAIGN NAME",
            minWidth: 200,
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
            field: "impressions_diff",
            headerName: "IMPRESSIONS % CHANGE",
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
            field: "clicks_diff",
            headerName: "CLICKS % CHANGE",
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
            field: "acos_diff",
            headerName: "ACOS % CHANGE",
        },
    ];

    const SuggestedKeywordsColumnZepto = [
        {
            field: "keyword_name",
            headerName: "SEARCH TERM",
            minWidth: 150,
            renderCell: (params) => (
                <div className="text-icon-div cursor-pointer redirect" onClick={() => handleKeywordClick(params.row.keyword_name, params.row.campaign_id)}>
                    <Typography variant="body2">{params.row.keyword_name}</Typography>
                </div>
            ),
        },
        {
            field: "match_type",
            headerName: "MATCH TYPE",
            minWidth: 100,
        },
        /*{
            field: "add_negative",
            headerName: "ADD NEGATIVE",
            minWidth: 150,
            renderCell: (params) => {
                const uniqueKey = params.row.campaign_id + params.row.campaign_type + params.row.keyword_id + params.row.ad_group_id;
                const isLoading = loadingRows[uniqueKey];

                return (
                    <div className="cursor-pointer">
                        {isLoading ? (
                            <CircularProgress size={20} />
                        ) : (
                            <AddCircleOutlineIcon color="error" onClick={() => handleAddNegativeKeyword(params.row)} />
                        )}
                    </div>
                );
            },
            align: "center"
        },*/
        {
            field: "campaign_name",
            headerName: "CAMPAIGN NAME",
            minWidth: 200,
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
            field: "orders",
            headerName: "ORDERS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.orders} percentValue={params.row.orders_change} />
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
            field: "ctr",
            headerName: "CTR",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.ctr} percentValue={params.row.ctr_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cvr",
            headerName: "CVR",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cvr} percentValue={params.row.cvr_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "aov",
            headerName: "AOV",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.aov} percentValue={params.row.aov_change} />
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

   const SuggestedKeywordsColumnFlipkart = [
    {
        field: "keyword_name",
        headerName: "SEARCH TERM",
        minWidth: 200,
        renderCell: (params) => (
            <div
                className="text-icon-div cursor-pointer redirect"
                onClick={() =>
                    handleKeywordClick(
                        params.row.keyword_name,
                        params.row.campaign_id
                    )
                }
            >
                <Typography variant="body2">
                    {params.row.keyword_name}
                </Typography>
            </div>
        ),
    },

    {
        field: "type",
        headerName: "CAMPAIGN TYPE",
        minWidth: 150,
    },

    {
        field: "match_type",
        headerName: "MATCH TYPE",
        minWidth: 150,
    },

    {
        field: "campaign_name",
        headerName: "CAMPAIGN NAME",
        minWidth: 200,
    },

    {
        field: "impressions",
        headerName: "IMPRESSIONS",
        minWidth: 150,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.impressions}
                percentValue={params.row.impressions_change}
            />
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
            <ColumnPercentageDataComponent
                mainValue={params.row.clicks}
                percentValue={params.row.clicks_change}
            />
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
            <ColumnPercentageDataComponent
                mainValue={params.row.orders}
                percentValue={params.row.orders_change}
            />
        ),
        type: "number",
        align: "left",
        headerAlign: "left",
    },

    {
        field: "spend",
        headerName: "SPENDS",
        minWidth: 150,
        renderCell: (params) => (
            <ColumnPercentageDataComponent
                mainValue={params.row.spend}
                percentValue={params.row.spend_change}
            />
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
            <ColumnPercentageDataComponent
                mainValue={params.row.revenue}
                percentValue={params.row.revenue_change}
            />
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
            <ColumnPercentageDataComponent
                mainValue={params.row.cpm}
                percentValue={params.row.cpm_change}
            />
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
            <ColumnPercentageDataComponent
                mainValue={params.row.roas}
                percentValue={params.row.roas_change}
            />
        ),
        type: "number",
        align: "left",
        headerAlign: "left",
    },
];

    const SuggestedKeywordsColumnSwiggy = [
        {
            field: "keyword_name",
            headerName: "SEARCH TERM",
            minWidth: 150,
            renderCell: (params) => (
                <div className="text-icon-div cursor-pointer redirect" onClick={() => handleKeywordClick(params.row.keyword_name, params.row.campaign_id)}>
                    <Typography variant="body2">{params.row.keyword_name}</Typography>
                </div>
            ),
        },
        
        
        { field: "match_type", headerName: "MATCH TYPE", minWidth: 150 },
        {
            field: "campaign_name",
            headerName: "CAMPAIGN NAME",
            minWidth: 200,
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
            field: "orders",
            headerName: "ORDERS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.orders} percentValue={params.row.orders_change} />
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
            field: "revenue",
            headerName: "SALES",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.revenue} percentValue={params.row.revenue_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        
        {
            field: "aov",
            headerName: "AOV",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.aov} percentValue={params.row.aov_change} />
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


    const handleSnackbarOpen = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const columns = useMemo(() => {
        if (operator === "Flipkart") return SuggestedKeywordsColumnFlipkart;
        if (operator === "Swiggy") return SuggestedKeywordsColumnSwiggy;

        if (operator === "Zepto") return SuggestedKeywordsColumnZepto;
        return [];
    }, [operator]);

    return (
        <React.Fragment>
            <div className="shadow-box-con-keywords aggregated-view-con">
                <div className="datatable-con-negative-keywords">
                    <MuiDataTableComponent
                        isLoading={isLoading}
                        isExport={true}
                        columns={columns}
                        data={keywordsData.data || []} />
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

export default SuggestedKeywordsDatatable;