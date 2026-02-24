import React from "react";
import { Typography } from "@mui/material";

const ValueFormatter = ({ value }) => {
  const formattedValue = value != null ? Number(value).toFixed(2) : "-";

  return (
    <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
      {formattedValue}
    </Typography>
  );
};

export default ValueFormatter;