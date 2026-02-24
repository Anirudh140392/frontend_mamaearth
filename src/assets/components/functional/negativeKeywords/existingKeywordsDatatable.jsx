import React, { useEffect, useContext, useState, useRef,useMemo } from "react";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import '../../../styles/keywordsComponent/keywordsComponent.less';
import { Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import overviewContext from "../../../../store/overview/overviewContext";
import { useSearchParams } from "react-router";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { getCache, setCache } from "../../../../services/cacheUtils";

const ExistingKeywordsDatatable = () => {

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
            const url = `https://react-api-script.onrender.com/mamaearth/existing_negative_keyword?start_date=${startDate}&end_date=${endDate}&platform=${operator}`;
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
            
            // Cache the response
            setCache(cacheKey, data, 5 * 60 * 1000); // 5 minutes TTL
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
        const uniqueKey = row.keyword_id + row.campaign_type;

        if (!token) {
            handleSnackbarOpen("Access token missing", "error");
            return;
        }

        setLoadingRows(prev => ({ ...prev, [uniqueKey]: true }));

        const params = new URLSearchParams({
            platform: operator,
            campaign_type: row.campaign_type,
            keyword_id: row.keyword_id,
        });

        try {
            const response = await fetch(`https://react-api-script.onrender.com/mamaearth/delete_negative_keyword?${params.toString()}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            handleSnackbarOpen("Keyword added as negative successfully!", "success");

            setKeywordsData(prev => ({
                ...prev,
                data: prev.data.filter(
                    item => !(item.keyword_id === row.keyword_id && item.campaign_type === row.campaign_type)
                )
            }));

        } catch (error) {
            console.error("Failed to update keyword:", error.message);
            handleSnackbarOpen("Failed to add as negative", "error");
        } finally {
            setLoadingRows(prev => {
                const updated = { ...prev };
                delete updated[uniqueKey];
                return updated;
            });
        }
    };

    const ExistingKeywordsColumnFlipkart = [
        {
            field: "keyword",
            headerName: "KEYWORD",
            minWidth: 150,
            renderCell: (params) => (
                <div className="text-icon-div cursor-pointer redirect" onClick={() => handleKeywordClick(params.row.keyword, params.row.campaign_id_y)}>
                    <Typography variant="body2">{params.row.keyword}</Typography>
                </div>
            ),
        },
        {
            field: "add_negative",
            headerName: "",
            minWidth: 150,
            renderCell: (params) => {
                const uniqueKey = params.row.keyword_id + params.row.campaign_type;
                const isLoading = loadingRows[uniqueKey];

                return (
                    <div className="cursor-pointer">
                        {isLoading ? (
                            <CircularProgress size={20} />
                        ) : (
                            <DeleteForeverIcon color="error" onClick={() => handleAddNegativeKeyword(params.row)} />
                        )}
                    </div>
                );
            },
            align: "center"
        },
        { field: "ad_type", headerName: "AD TYPE", minWidth: 150 },
        {
            field: "campaign_name",
            headerName: "CAMPAIGN NAME",
            minWidth: 200,
        },
        {
            field: "ad_group_name",
            headerName: "AD GROUP",
            minWidth: 150,
        },
        {
            field: "keyword_type",
            headerName: "KEYWORD TYPE",
            minWidth: 150,
        },
    ];

    const handleSnackbarOpen = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

     const columns = useMemo(() => {
            if (operator === "Flipkart") return ExistingKeywordsColumnFlipkart;
            
           
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

export default ExistingKeywordsDatatable;