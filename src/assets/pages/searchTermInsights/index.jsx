import React, { useState } from "react";
import ErrorBoundary from "../../components/common/erroBoundryComponent";
import SearchTermInsightsDatatable from "../../components/functional/searchTermInsights/searchTermInsightsDatatable";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import overviewContext from "../../../store/overview/overviewContext";
    const SearchTermInsights = () => {
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
    return(
        <React.Fragment>
            <div className="container">
                <div className="card mt-0">
                   
                       
                    </div>
                    <div className="card-body">
                        <ErrorBoundary>
                            <SearchTermInsightsDatatable />
                        </ErrorBoundary>
                    </div>
                </div>
            
        </React.Fragment>
    )
}

export default SearchTermInsights;