import React from "react";
import PlusIcon from "../../../icons/blockers/plusIcon";
import DataTableComponent from "../../common/datatableComponent";
import ExcelDownloadButton from "../../molecules/excelDownloadButton";
import RadioCheckboxComponent from "../../molecules/radioCheckboxComponent";

const BlockersDatatable = () => {

    const BlockersColumn = [
        {
            name: 'Search Term',
            selector: row => <span>
                <RadioCheckboxComponent
                    fieldType="checkbox"
                    fieldName="searchTerm"
                    ariaLabel="search-term"
                    fieldLabel={row.searchTerm} />
            </span>,
            sortable: false,
            width: '250px'
        },
        {
            name: 'Add As Negative',
            selector: row => <span>
                <button className="btn btn-sm btn-danger">
                    <PlusIcon
                        iconWidth="15"
                        iconHeight="15"
                        iconColor="#fff" />
                </button>
            </span>,
            sortable: false,
            width: '150px'
        },
        {
            name: 'Ad Group',
            selector: row => row.ad_group,
            sortable: false,
            width: '150px'
        },
        {
            name: 'Campaign Name',
            selector: row => row.camp_name,
            sortable: false,
            width: '150px'
        },
        {
            name: 'Impressions',
            selector: row => row.impressions,
            sortable: false,
            width: '150px'
        },
        {
            name: 'Clicks',
            selector: row => row.clicks,
            sortable: false,
            width: '150px'
        },
        {
            name: 'Spends',
            selector: row => row.spends,
            sortable: false,
            width: '150px'
        },
        {
            name: 'Sales',
            selector: row => row.sales,
            sortable: false,
            width: '150px'
        },
        {
            name: 'CTR',
            selector: row => row.ctr,
            sortable: false,
            width: '150px'
        },
        {
            name: 'Orders',
            selector: row => row.orders,
            sortable: false,
            width: '150px'
        },
        {
            name: 'ROAS',
            selector: row => row.roas,
            sortable: false,
            width: '150px'
        },
    ]

    const BlockersData = [
        {
            searchTerm: 'purchases=(related-product lookback=180)',
            ad_group: 'Purchase Remarketing',
            camp_name: 'HM_NV_BL_SD_Purchase_Remarketing_DPV_CPC',
            impressions: '76888',
            clicks: '504',
            spends: '2452.1',
            sales: '0',
            ctr: '0.6%',
            orders: '0',
            roas: '0'
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
                    columns={BlockersColumn}
                    data={BlockersData} />
            </div>
        </React.Fragment>
    )
}

export default BlockersDatatable;