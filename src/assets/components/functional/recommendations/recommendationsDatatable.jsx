import React from "react";
import PlusIcon from "../../../icons/blockers/plusIcon";
import DataTableComponent from "../../common/datatableComponent";
import ExcelDownloadButton from "../../molecules/excelDownloadButton";
import RadioCheckboxComponent from "../../molecules/radioCheckboxComponent";

const RecommendationsDatatable = () => {

    const RecommendationColumn = [
        {
            name: 'UserName',
            selector: row => <span>
                <RadioCheckboxComponent
                    fieldType="checkbox"
                    fieldName="searchTerm"
                    ariaLabel="search-term"
                    fieldLabel={row.userName} />
            </span>,
            sortable: false,
            width: '150px'
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: false,
            width: '150px'
        },
        {
            name: 'Campaign Name',
            selector: row => row.camp_name,
            sortable: false,
            width: '250px'
        },
        {
            name: 'Placement',
            selector: row => row.placement,
            sortable: false,
            width: '200px'
        },
        {
            name: 'Platform',
            selector: row => row.platform,
            sortable: false,
            width: '150px'
        },
        {
            name: 'Suggestion',
            selector: row => row.suggestion,
            sortable: false,
            width: '250px'
        },
        {
            name: 'Type',
            selector: row => row.type,
            sortable: false,
            width: '100px'
        },
    ]

    const RecommendationData = [
        {
            userName: 'Nivea',
            date: '2024-05-15',
            camp_name: 'HM_NV_BL_SD_Purchase_Remarketing_DPV_CPC',
            placement: 'SEARCH_PAGE_TOP_SLOT',
            platform: 'GROCERY',
            suggestion: 'Decrease the Bid it is Out Of Range',
            type: 'PCA',
        }
    ]

    return(
        <React.Fragment>
            <div className=" py-2 border-bottom">
                <div className="row">
                    <div className="col-6">
                        <small className="d-inline-block py-1 px-2 bg-light rounded-pill">
                            report_date = Total 7 Days
                        </small>
                    </div>
                    <div className="col-6 text-end">
                        <ExcelDownloadButton
                            buttonClass="excel-button bg-dark text-white border-dark"
                            buttonLabel="Export" />
                    </div>
                </div>
            </div>
            <div className="datatable-con">
                <DataTableComponent
                    columns={RecommendationColumn}
                    data={RecommendationData} />
            </div>
        </React.Fragment>
    )
}

export default RecommendationsDatatable;