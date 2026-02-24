import React, { useEffect } from "react";
import { useContext, useMemo } from "react";
import OverviewFunnelChart from "./overview/overviewFunnelChart";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import overviewContext from "../../../../store/overview/overviewContext";
import { useSearchParams } from "react-router";
import ColumnPercentageDataComponent from "../../common/columnPercentageDataComponent";
import GoalComponent from "./overview/goalComponent";
import ErrorBoundary from "../../common/erroBoundryComponent";
import OnePercentageDataComponent from "../../common/onePercentageComponent";
import OverviewCardTopBox from "./overview/OverviewCardTopBox";
import GoalsOverview from "./GoalsOverviews/GoalsOverview";
import AggregatedView from "./overview/AggregatedView";

const OverviewComponent = () => {

    const dataContext = useContext(overviewContext)
    const { overviewData, getOverviewData, getBrandsData, dateRange, campaignName, formatDate } = dataContext
    //const { dateRange, getBrandsData, brands, formatDate, campaignName } = useContext(overviewContext)
    const { brands } = dataContext;
    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");

    const CategoryColumnsAmazon = [
        { field: "Campaign_Tags", headerName: "CAMPAIGN TAGS", minWidth: 200, type: "string", align: "left", headerAlign: "left" },
        { field: "Estimated_Budget_Consumed", headerName: "SPEND", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "Clicks", headerName: "CLICKS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "Impressions", headerName: "IMPRESSIONS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "Total_Sales", headerName: "SALES", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "Total_Orders", headerName: "ORDERS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "ROAS", headerName: "ROAS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "CPM", headerName: "CPM", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "ACOS", headerName: "ACOS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
    ]

    const CategoryColumnsZepto = [
        { field: "Campaign_Tags", headerName: "CAMPAIGN TAGS", minWidth: 200, type: "string", align: "left", headerAlign: "left" },
        { field: "Spend", headerName: "SPEND", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "Clicks", headerName: "CLICKS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
         { field: "CPM", headerName: "CPM", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
          { field: "CPC", headerName: "CPC", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "Impressions", headerName: "IMPRESSIONS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "Sales", headerName: "SALES", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "Orders", headerName: "ORDERS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "ROAS", headerName: "ROAS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
       
        { field: "ACOS", headerName: "ACOS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
    ];

    const CategoryColumnsFlipkart = [
        {
            field: "Campaign_Tags",
            headerName: "CAMPAIGN TAGS",
            minWidth: 200,
            type: "string",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "Spend",
            headerName: "SPEND",
            minWidth: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "Clicks",
            headerName: "CLICKS",
            minWidth: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
        },
         {
            field: "CPM",
            headerName: "CPM",
            minWidth: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "CPC",
            headerName: "CPC",
            minWidth: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "Impressions",
            headerName: "IMPRESSIONS",
            minWidth: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "Sales",
            headerName: "SALES",
            minWidth: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
        },

        {
            field: "Orders",
            headerName: "ORDERS",
            minWidth: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {
            field: "ROAS",
            headerName: "ROAS",
            minWidth: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
        },
        {  field: "CTR",
            headerName: "CTR",
            minWidth: 150,
            type: "number",
            align: "left",
            headerAlign: "left",

        },
       
        {
            field: "ACOS",
            headerName: "ACOS",
            minWidth: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
        },
    ];


    const CategoryColumnsSwiggy = [
        { field: "Campaign_Tags", headerName: "CAMPAIGN TAGS", minWidth: 200, type: "string", align: "left", headerAlign: "left" },
        { field: "Spend", headerName: "SPEND", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "Clicks", headerName: "CLICKS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
         { field: "CPC", headerName: "CPC", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
           { field: "CPM", headerName: "CPM", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "Impressions", headerName: "IMPRESSIONS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "Sales", headerName: "SALES", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "Orders", headerName: "ORDERS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
        { field: "ROAS", headerName: "ROAS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
       
        { field: "ACOS", headerName: "ACOS", minWidth: 150, type: "number", align: "left", headerAlign: "left" },
    ]


    const SubCategoryColumns = [
        { field: "sub_category", headerName: "SUBCATEGORY", minWidth: 150 },
        { field: "category", headerName: "CATEGORY", minWidth: 150 },
        {
            field: "views",
            headerName: "IMPRESSIONS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.views} percentValue={params.row.views_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "views_pct_change",
            headerName: "IMPRESSIONS % CHANGE",
            hideable: false
        },
        {
            field: "clicks",
            headerName: "CLICKS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.clicks} percentValue={params.row.clicks_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "clicks_pct_change",
            headerName: "CLICKS % CHANGE",
            hideable: false
        },
        {
            field: "cpc",
            headerName: "CPC",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cpc} percentValue={params.row.cpc_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cpc_pct_change",
            headerName: "CPC % CHANGE",
            hideable: false
        },
        {
            field: "cost",
            headerName: "SPENDS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.cost} percentValue={params.row.cost_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "cost_pct_change",
            headerName: "SPENDS % CHANGE",
            hideable: false
        },
        {
            field: "total_converted_revenue",
            headerName: "SALES",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.total_converted_revenue} percentValue={params.row.total_converted_revenue_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "total_converted_revenue_pct_change",
            headerName: "SALES % CHANGE",
            hideable: false
        },
        {
            field: "acos",
            headerName: "ACOS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.acos} percentValue={params.row.acos_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "acos_pct_change",
            headerName: "ACOS % CHANGE",
            hideable: false
        },
        {
            field: "roi",
            headerName: "ROAS",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.roi} percentValue={params.row.roi_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "roi_pct_change",
            headerName: "ROAS % CHANGE",
            hideable: false
        },
        {
            field: "aov",
            headerName: "AOV",
            minWidth: 150,
            renderCell: (params) => (
                <ColumnPercentageDataComponent mainValue={params.row.aov} percentValue={params.row.aov_pct_change} />
            ), type: "number", align: "left",
            headerAlign: "left",
        },
        {
            field: "aov_pct_change",
            headerName: "AOV % CHANGE",
            hideable: false
        },
    ];



    const columns = useMemo(() => {
        if (operator === "Amazon") return CategoryColumnsAmazon;
        if (operator === "Zepto") return CategoryColumnsZepto;
        if (operator === "Flipkart") return CategoryColumnsFlipkart;
        if (operator === "Swiggy") return CategoryColumnsSwiggy;
        if (operator === "Blinkit") return CategoryColumnsFlipkart; // Blinkit uses same structure as Flipkart
        return CategoryColumnsFlipkart; // Default to standard structure
    }, [operator, brands]);


    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            getOverviewData();
        }
    }, [operator, dateRange, getOverviewData]);

    const CTRWidget = ({ firstHeadingText, firstHeadingData, secondHeadingText, secondHeadingData, isSecondHeadingRequired = true }) => {
        return (
            <div className="ctr-card-main-con">
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <div>
                            <h5 className="card-title text-aqua">{firstHeadingText}</h5>
                            <h3 className="mb-0">{firstHeadingData}</h3>
                        </div>
                        {isSecondHeadingRequired &&
                            <div>
                                <h5 className="card-title text-peach">{secondHeadingText}</h5>
                                <h3 className="mb-0">{secondHeadingData}</h3>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

    function toLakhs(num) {
        return (num / 100_000).toFixed(2) + "L";
    }

    function toThousands(num) {
        return (num / 1_000).toFixed(2) + "K";
    }

    const daysDifference = () => {
        if (!dateRange?.length) return 0;
        const startDate = new Date(dateRange[0].startDate);
        const endDate = new Date(dateRange[0].endDate);
        const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
        return diff === 6 ? diff + 1 : diff;
    }

    const filteredCatData = overviewData?.cat_table?.filter(row => {
        // For new API structure with Campaign_Tags
        if (row.Campaign_Tags) {
            return row.Campaign_Tags?.trim() !== '';
        }
        // Fallback for old structure with category
        return row.category?.trim() !== '';
    });
    const filteredSubCatData = overviewData?.sub_cat_table?.filter(row => row.sub_category?.trim() !== '');

    return (
        <React.Fragment>
            <div className="shadow-box-con top-overview-con">
                <div className="row">
                    <OverviewCardTopBox overViewData={overviewData} />
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="agrregated-shadow-box-con aggregated-view-con">
                            <div className="px-3 py-2 border-bottom">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <h5 className="mb-0">Campaign Tag View</h5>
                                    </div>
                                </div>
                                <div>
                                </div>
                            </div>
                            <div className="datatable-con-overview">
                                <MuiDataTableComponent
                                    isExport={true}
                                    columns={columns}
                                    data={filteredCatData} />
                            </div>
                            <div className="shadow-box-con top-overview-con">
                                <AggregatedView />
                            </div>
                            <div className="shadow-box-con top-overview-con">
                                <GoalsOverview />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*<div className="agrregated-shadow-box-con aggregated-view-con">
                <div className="px-3 py-2 border-bottom">
                    <div className="row">
                        <div className="col-lg-6">
                            <h5 className="mb-0">Subcampaign Tag View</h5>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
                <div className="datatable-con-overview">
                    <MuiDataTableComponent
                        isExport={true}
                        columns={SubCategoryColumns}
                        data={filteredSubCatData} />
                </div>
            </div>
            <ErrorBoundary>
                <GoalComponent />
    </ErrorBoundary>*/}
        </React.Fragment>
    )
}

export default OverviewComponent;