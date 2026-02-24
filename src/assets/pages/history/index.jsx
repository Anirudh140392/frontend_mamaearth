import React from "react";
import ErrorBoundary from "../../components/common/erroBoundryComponent";
import HistoryDatatable from "../../components/functional/history/historyDatatable";

const History = () => {
    return (
        <React.Fragment>
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <ErrorBoundary>
                            <HistoryDatatable />
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default History;