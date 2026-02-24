import React from "react";
import DataTable from "react-data-table-component";

const DataTableComponent = (props) => {

    const {columns,
        data,
        rowsPerPage} = props;

    return(
        <React.Fragment>
            <DataTable
                columns={columns}
                data={data}
                highlightOnHover
                pagination
                paginationPerPage={5}
                paginationRowsPerPageOptions={rowsPerPage ? rowsPerPage : [10, 25, 50, 100]}
                paginationComponentOptions={{
                    rowsPerPageText: 'Records per page:',
                    rangeSeparatorText: 'out of',
                }}
            />
        </React.Fragment>
    )
}

export default DataTableComponent;