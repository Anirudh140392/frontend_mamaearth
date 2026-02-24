import React, { useContext, useEffect, useState, useRef } from "react";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import ExcelDownloadButton from "../../molecules/excelDownloadButton";
import overviewContext from "../../../../store/overview/overviewContext";
import { useSearchParams } from "react-router";
import ColumnPercentageDataComponent from '../../common/columnPercentageDataComponent';
import Typography from '@mui/material/Typography';
import NewPercentageDataComponent from "../../common/newPercentageDataComponent";






const SearchTermInsightsDatatable = () => {
    const { dateRange, formatDate } = useContext(overviewContext);
    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");

    const [keywordData, setKeywordData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const abortControllerRef = useRef(null);

    const fetchKeywordData = async () => {
        if (!operator) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("Missing access token");
            setIsLoading(false);
            return;
        }

        const startDate = formatDate(dateRange[0].startDate);
        const endDate = formatDate(dateRange[0].endDate);

        try {
            const response = await fetch(
                `https://react-api-script.onrender.com/bowlers/keyword-search-term-page?start_date=2025-06-27&end_date=2025-07-03&platform=Amazon `,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal,
                }
            );

            if (!response.ok) throw new Error("Failed to fetch keyword data");

            const result = await response.json();
            setKeywordData(result.data || []);
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Error fetching keyword data:", error);
                setKeywordData([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchKeywordData();
        }, 100);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            clearTimeout(timeout);
        }
    }, [operator, dateRange]);

    const KeywordAnalysisColumnAmazon = [
        {
            field: "keyword",
            headerName: "SEARCH TERM",
            minWidth: 150,
            //pinned: 'left',
            renderCell: (params) => (

                <div className="text-icon-div">
                    <Typography variant="body2">{params.row.keyword}</Typography>
                </div>
            ),
            


        },
        {
            field: "campaigns_count_x", headerName: "# CAMPAIGNS", minWidth: 150,

        },
        {
            field: "IMPR_percent_share", headerName: "IMPR. % SHARE", minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.IMPR_percent_share}
                    percentValue={params.row.impressions_diff} // use this if diff exists
                />
            ),
            type: "number",
            align: "left",

            headerAlign: "left"


        },
        {
            field: "impressions_diff",
            headerName: "IMPR % CHANGE",
            minWidth: 100,

            hideable: false
        },
        {
            field: "organic_sov",
            headerName: "ORGANIC  SOV",
            minWidth: 150,
            align: "left",
            headerAlign: "left",
        },


        {
            field: "spend_x",
            headerName: "SPENDS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.spend_x} percentValue={params.row.spend_diff} />
            ),
            type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "spend_diff",
            headerName: "SPENDS % CHANGE",

            hideable: false
        }
        ,
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
        }
        ,
        {
            field: "ctr_x",
            headerName: "CTR",
            minWidth: 150,
            renderCell: (params) => (
                <NewPercentageDataComponent firstValue={params.row.ctr_x} secValue={params.row.ctr_diff} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "ctr_diff",
            headerName: "CTR % CHANGE",
            hideable: false
        }
        ,
        {
            field: "ad_type",
            headerName: "AD TYPE",
            minWidth: 150,
            renderCell: (params) => (
                <div className="text-icon-div">
                    <Typography variant="body2">{params.row.ad_type}</Typography>
                </div>
            ),
            align: "left",
            headerAlign: "left",
        },
        ,
        {
            field: "total_IMPR",
            headerName: "TOTAL IMPR.",
            minWidth: 150,
            type: "number", align: "left",
            headerAlign: "left",
        },
        ,
        {
            field: "rank_x",
            headerName: "ORGANIIC RANK",
            minWidth: 150,
            type: "number", align: "left",
            headerAlign: "left",
        },
        ,
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
            field: "roas_diff",
            headerName: "ROAS % CHANGE",
            hideable: false
        },
    ];

    return (
        <React.Fragment>
            <div className="py-2 border-bottom">
                <div className="row">
                    <div className="col-6">
                        <small className="d-inline-block py-1 px-2 bg-light rounded-pill">
                            report_date = Total 7 Days
                        </small>
                    </div>

                </div>
            </div>
            <div className="datatable-con-product-analytics">
                <MuiDataTableComponent
                    isLoading={isLoading}
                    isExport={true}
                    columns={KeywordAnalysisColumnAmazon}
                    data={keywordData}
                />
            </div>
        </React.Fragment>
    );
};

export default SearchTermInsightsDatatable;
