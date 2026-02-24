import React from "react";
import ExcelIcon from "../../icons/performanceOverview/excelIcon";

const ExcelDownloadButton = (props) => {

    const { buttonClass,
        buttonLabel, handleExport, columns, rows } = props;

    return (
        <React.Fragment>
            <button onClick={() => handleExport(columns, rows)} className={buttonClass}>
                <ExcelIcon
                    iconClass="me-1"
                    iconWidth="15"
                    iconHeight="15"
                    iconColor="#fff" /> {buttonLabel}
            </button>
        </React.Fragment>
    )
}

export default ExcelDownloadButton;