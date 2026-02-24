import React from "react";
import ErrorBoundary from "../../components/common/erroBoundryComponent";
import BlockersDatatable from "../../components/functional/blockers/blockersDatatable";

const Blockers = () => {
    return(
        <React.Fragment>
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col">
                                <h1 className="page-heading">Blockers</h1>
                            </div>
                            <div className="col text-end">
                                
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <ErrorBoundary>
                            <BlockersDatatable />
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Blockers;