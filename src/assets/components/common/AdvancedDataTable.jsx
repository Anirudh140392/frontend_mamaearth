import React, { useState, useEffect, useRef } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const AdvancedDataTable = ({
  columns = [],
  rows = [],
  loading = false,
  checkboxSelection = false,
  hideFooter = false,
  showExportButton = true,
  dynamicHeight = 748,
  defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50],
}) => {
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const containerRef = useRef(null);
  const [calculatedHeight, setCalculatedHeight] = useState(dynamicHeight);

  useEffect(() => {
    if (!containerRef.current) return;

    const rowHeight = 52;
    const headerHeight = 56;
    const toolbarHeight = showExportButton ? 56 : 0;
    const totalHeight = rows.length * rowHeight + headerHeight + toolbarHeight + 14;

    setCalculatedHeight(Math.min(totalHeight, dynamicHeight));
  }, [rows, dynamicHeight, showExportButton]);

  const CustomToolbar = () => (
    <GridToolbar
      csvOptions={showExportButton ? { allColumns: true } : { disableToolbarButton: true }}
      printOptions={showExportButton ? { disableToolbarButton: true } : { disableToolbarButton: true }}
    />
  );

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <Box
        sx={{
          height: calculatedHeight,
          width: "100%",
          overflow: calculatedHeight >= dynamicHeight ? "auto" : "visible",
          padding: "7px",
        }}
      >
        <DataGrid
          autoHeight={calculatedHeight < dynamicHeight}
          columns={columns}
          rows={rows.map((row, i) => ({ id: i + 1, ...row }))}
          loading={loading}
          checkboxSelection={checkboxSelection}
          disableSelectionOnClick
          slots={{ toolbar: CustomToolbar }}
          rowsPerPageOptions={pageSizeOptions}
          hideFooter={hideFooter}
          onPaginationModelChange={(model) => setPageSize(model.pageSize)}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#e0e0e0",
              fontWeight: "bold",
              textTransform: "uppercase",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#000",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: "#f8f9fa",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#e9ecef",
            },
            "& .MuiDataGrid-toolbarContainer": {
              backgroundColor: "#f0f0f0",
            },
          }}
        />
      </Box>
    </div>
  );
};

export default AdvancedDataTable;
