import React from "react";
import MuiDataTableComponent from "../../../common/muidatatableComponent";

const AlertsComponent = () => {

    const AlertsViewColumn = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'date', headerName: 'Date', width: 150 },
        { field: 'sku', headerName: 'SKU', width: 150 },
        { field: 'title', headerName: 'Title', width: 250 },
        { field: 'type', headerName: 'Type', width: 100 },
        { field: 'from', headerName: 'From', width: 100 },
        { field: 'to', headerName: 'To', width: 100 },
    ];

    const AlertsData = [
    ];

    return (
        <React.Fragment>
            <div className="agrregated-shadow-box-con aggregated-view-con mt-0">
                <div className="px-3 py-2 border-bottom">
                    <h5 className="mb-0">Alerts</h5>
                </div>
                <div className="datatable-con">
                    <MuiDataTableComponent
                        columns={AlertsViewColumn}
                        data={AlertsData} />
                </div>
            </div>
        </React.Fragment>
    )
}

export default AlertsComponent;