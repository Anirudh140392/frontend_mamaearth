import React from "react";
import { Typography } from "@mui/material";

const NewPercentageDataComponent = ({ firstValue, secValue }) => {
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
    return (
            <div className="d-flex align-items-center justify-content-between w-100 h-100">
                <Typography sx={{ fontSize: "14px", flex: 1, textAlign: "left" }}>
                    {firstValue}%
                </Typography>
                <Typography sx={{ fontSize: "14px", flex: 1, textAlign: "right", color: getColorCode(secValue)}}>
                    {secValue}% 
                </Typography>
            </div>
        )
    }

    export default NewPercentageDataComponent;