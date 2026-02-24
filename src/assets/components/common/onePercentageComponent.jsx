import React from "react";
import { Typography } from "@mui/material";

const OnePercentageDataComponent = ({ firstValue}) => {
      
    return (
            <div className="d-flex align-items-center justify-content-between w-100 h-100">
                <Typography sx={{ fontSize: "14px", flex: 1, textAlign: "left" }}>
                    {firstValue}%
                </Typography>
                
            </div>
        )
    }

    export default OnePercentageDataComponent;