import React from "react";
import ErrorBoundary from "../../components/common/erroBoundryComponent";
import RecommendationsDatatable from "../../components/functional/recommendations/recommendationsDatatable";

const Recommendations = () => {
    return(
        <React.Fragment>
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col">
                                <h1 className="page-heading">Recommendations</h1>
                            </div>
                            <div className="col text-end">
                                
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <ErrorBoundary>
                            <RecommendationsDatatable />
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Recommendations;