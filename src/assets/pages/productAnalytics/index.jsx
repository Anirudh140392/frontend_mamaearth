import React, { useState, useEffect, useContext } from "react";
import "../../styles/performanceOverview/performanceOverview.less";
import ErrorBoundary from "../../components/common/erroBoundryComponent";
import { useLocation } from "react-router";
import overviewContext from "../../../store/overview/overviewContext";
import ProductAnalyticsDatatable from "../../components/functional/productAnalytics/productAnalyticsDatatable";

const ProductAnalyticsComponent = () => {
    const location = useLocation();
    const [operatorName, setoperatorName] = useState("");
    const { dateRange } = useContext(overviewContext) || {
        dateRange: [{ startDate: new Date(), endDate: new Date() }],
    };

    const daysDifference = () => {
        if (!dateRange?.length) return 0;
        const startDate = new Date(dateRange[0].startDate);
        const endDate = new Date(dateRange[0].endDate);
        const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        return diff === 6 ? diff + 1 : diff;
    };

    return (
        <React.Fragment>
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <div className="border-bottom py-1 position-relative d-flex justify-content-between">
                            <small className="d-inline-block py-1 px-2 bg-light rounded-pill">
                                Report Date = Last {daysDifference()} Days
                            </small>
                        </div>
                        <ErrorBoundary>
                            <ProductAnalyticsDatatable />
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProductAnalyticsComponent;
