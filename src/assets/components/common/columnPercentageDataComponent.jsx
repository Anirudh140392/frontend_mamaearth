import React from "react";
import { Typography } from "@mui/material";

const ColumnPercentageDataComponent = ({ mainValue, percentValue }) => {
    const getColorCode = (value) => {
        if (value === 0) {
            return "#ffc107"
        }
        else if (value < 0) {
            return "#dc3545"
        }
        else {
            return "#198754"
        }
    }

    const getIcon = (value) => {
        if (value === 0) {
            return <span style={{ color: "#ffc107", fontSize: "0.75rem" }}>-</span>
        }
        else if (value < 0) {
            return <span style={{ color: "#dc3545", fontSize: "0.75rem" }}>↓</span>
        }
        else {
            return <span style={{ color: "#198754", fontSize: "0.75rem" }}>↑</span>
        }
    }
    return (
        <div className="d-flex align-items-center justify-content-between w-100 h-100">
            <Typography sx={{ fontSize: "14px", flex: 1, textAlign: "left" }}>
                {mainValue}
            </Typography>
            <Typography sx={{ fontSize: "14px", flex: 1, textAlign: "right", color: getColorCode(percentValue) }}>
                {percentValue}% {getIcon(percentValue)}
            </Typography>
        </div>
    )
}

export default ColumnPercentageDataComponent;