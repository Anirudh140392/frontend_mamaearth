import React from "react";
import { Button } from "@mui/material";
import MuiDataTableComponent from "../../../common/muidatatableComponent";

const ActiveRulesComponent = () => {

    const ActiveRulesColumn = [
        { field: 'id', headerName: '#', width: 100 },
        { field: 'rule_name', headerName: 'Rule Name', width: 150 },
        { field: 'module', headerName: 'Module', width: 150 },
        { field: 'rule_type', headerName: 'Rule Type', width: 100 },
        { field: 'schedule', headerName: 'Schedule', width: 150 },
        { 
            field: 'view_rule', 
            headerName: 'View Rule', 
            width: 150,
            sortable: false,
            renderCell: () => (
                <Button variant="contained" size="small" color="primary">
                    View
                </Button>
            ),
        },
    ];
    
    const ActiveRulesData = [
    ];

    return(
        <React.Fragment>
            <div className="agrregated-shadow-box-con aggregated-view-con mt-0">
                <div className="px-3 py-2 border-bottom">
                    <h5 className="mb-0">Active Rules</h5>
                </div>
                <div className="datatable-con">
                    <MuiDataTableComponent
                        columns={ActiveRulesColumn}
                        data={ActiveRulesData} />
                </div>
            </div>
        </React.Fragment>
    )
}

export default ActiveRulesComponent;