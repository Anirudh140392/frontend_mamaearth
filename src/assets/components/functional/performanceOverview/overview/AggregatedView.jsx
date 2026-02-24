import React, { useState, useMemo, useEffect, useContext } from "react";
import {
  Box,
  Card,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import AdvancedDataTable from "../../../common/AdvancedDataTable";
import ColumnPercentageDataComponent from "../../../common/columnPercentageDataComponent";
import { useSearchParams } from "react-router";
import overviewContext from "../../../../../store/overview/overviewContext";
import { cachedFetch } from "../../../../../services/cachedFetch";

const HEADERS = [
  { key: "tag", label: "Tag" },
  { key: "spends", label: "Spends" },
  { key: "spendShare", label: "Spend % Share" },
  { key: "sales", label: "Sales" },
  { key: "saleShare", label: "Sale % Share" },
  { key: "clicks", label: "Clicks" },
  { key: "orders", label: "Orders" },
  { key: "revenue", label: "ROAS" },
  { key: "impressions", label: "Total Impressions" },
  { key: "impressionsShare", label: "Impr % Share" },
];

const AggregatedView = () => {
  const [regionFilter, setRegionFilter] = useState("Business");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [tableData, setTableData] = useState([]);
  const [searchParams] = useSearchParams();
  const operator = searchParams.get("operator");
  const { dateRange, formatDate, selectedBrand, refreshTrigger } = useContext(overviewContext);

  // Map API data to table format
  const mappedData = useMemo(() => {
    if (!tableData || !Array.isArray(tableData) || tableData.length === 0) return [];

    // Calculate totals for percentage shares
    const totalSpends = tableData.reduce((sum, item) => sum + (Number(item.spends ?? item.spend ?? item.Spend ?? 0)), 0);
    const totalSales = tableData.reduce((sum, item) => sum + (Number(item.sales ?? item.sale ?? item.Sales ?? 0)), 0);
    const totalImpressions = tableData.reduce((sum, item) => sum + (Number(item.impressions ?? item.impression ?? item.Impressions ?? 0)), 0);

    return tableData.map((item) => {
      const curSpends = Number(item.spends ?? item.spend ?? item.Spend ?? 0);
      const curSales = Number(item.sales ?? item.sale ?? item.Sales ?? 0);
      const curImpressions = Number(item.impressions ?? item.impression ?? item.Impressions ?? 0);

      // Calculate percentage shares
      const spendSharePercent = totalSpends > 0 ? ((curSpends / totalSpends) * 100).toFixed(2) : 0;
      const saleSharePercent = totalSales > 0 ? ((curSales / totalSales) * 100).toFixed(2) : 0;
      const impressionsSharePercent = totalImpressions > 0 ? ((curImpressions / totalImpressions) * 100).toFixed(2) : 0;

      return {
        tag: item.tag || item.Tag || item.parameter_value || item.Campaign_Tags || "",
        spends: curSpends,
        spendsChange: Number(item.spends_pct_change ?? item.spend_pct_change ?? item.Spend_pct_change ?? 0),
        spendShare: spendSharePercent,
        spendShareChange: 0,
        sales: curSales,
        salesChange: Number(item.sales_pct_change ?? item.sale_pct_change ?? item.Sales_pct_change ?? 0),
        saleShare: saleSharePercent,
        saleShareChange: 0,
        clicks: Number(item.clicks ?? item.Clicks ?? 0),
        clicksChange: Number(item.clicks_pct_change ?? item.click_pct_change ?? 0),
        orders: Number(item.orders ?? item.Orders ?? 0),
        ordersChange: Number(item.orders_pct_change ?? item.order_pct_change ?? 0),
        revenue: Number(item.roas ?? item.ROAS ?? item.revenue ?? 0),
        revenueChange: 0,
        impressions: curImpressions,
        impressionsChange: Number(item.impressions_pct_change ?? item.impression_pct_change ?? 0),
        impressionsShare: impressionsSharePercent,
        impressionsShareChange: 0,
        avgCpc: Number(item.avg_cpc ?? item.cpc ?? item.CPC ?? 0),
        ctrPercent: Number(item.ctr_percent ?? item.ctr ?? item.CTR ?? 0),
      };
    });
  }, [tableData]);



  const fetchAggregated = async (bypass = false) => {
    if (!operator || !dateRange || !dateRange[0]) {
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setTableData([]);
        return;
      }

      const startDate = formatDate(dateRange[0].startDate);
      const endDate = formatDate(dateRange[0].endDate);
      const param =
        regionFilter === "Business"
          ? "business"
          : regionFilter === "Targeting"
            ? "targeting"
            : regionFilter === "Ad Type"
              ? "ad_type"
              : regionFilter.toLowerCase();

      let url = `https://react-api-script.onrender.com/mamaearth/aggregated-view?platform=${operator}&start_date=${startDate}&end_date=${endDate}&parameter_filter=${param}`;

      if (selectedBrand && selectedBrand.trim() !== "") {
        url += `&brand_name=${encodeURIComponent(selectedBrand)}`;
      }

      const cacheKey = `cache:GET:${url}`;
      const response = await cachedFetch(
        url,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
        { ttlMs: 5 * 60 * 1000, cacheKey, bypassCache: bypass }
      );

      if (!response.ok) {
        setTableData([]);
        return;
      }

      const json = await response.json();

      // Extract aggregated data from API response with robust fallbacks
      let rows = [];
      if (json?.data?.data && Array.isArray(json.data.data)) {
        rows = json.data.data;
      } else if (json?.data?.aggregated_data && Array.isArray(json.data.aggregated_data)) {
        rows = json.data.aggregated_data;
      } else if (json?.aggregated_data && Array.isArray(json.aggregated_data)) {
        rows = json.aggregated_data;
      } else if (json?.data && Array.isArray(json.data)) {
        rows = json.data;
      } else if (Array.isArray(json)) {
        rows = json;
      }

      setTableData(rows);
    } catch (error) {
      console.error("Failed to fetch aggregated data:", error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAggregated(refreshTrigger > 0);
  }, [operator, regionFilter, dateRange, selectedBrand, refreshTrigger]);

  const filteredData = useMemo(() => {
    let filtered = [...mappedData];

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (typeof valA === "number" && typeof valB === "number") {
          return sortConfig.direction === "asc" ? valA - valB : valB - valA;
        } else {
          return sortConfig.direction === "asc"
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
        }
      });
    }
    return filtered;
  }, [mappedData, sortConfig]);

  const columns = useMemo(
    () =>
      HEADERS.map((h) => ({
        field: h.key,
        headerName: h.label.toUpperCase(),
        flex: 1,
        minWidth: 120,
        sortable: true,
        renderCell: (params) => {
          const key = h.key;
          const row = params.row;
          if (
            [
              "spends",
              "spendShare",
              "sales",
              "saleShare",
              "clicks",
              "orders",
              "revenue",
              "impressions",
              "impressionsShare",
            ].includes(key)
          ) {
            return (
              <ColumnPercentageDataComponent
                mainValue={row[key]}
                percentValue={row[`${key}Change`] || 0}
              />
            );
          }
          if (key === "marketShare") return `${row[key]}%`;
          return row[key];
        },
      })),
    []
  );

  const handleExport = () => {
    const headers = HEADERS.map((h) => h.label.toUpperCase());
    const rowsData = filteredData.map((row) => HEADERS.map((h) => row[h.key]));
    const csvContent = [headers, ...rowsData]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "aggregated_data.csv");
    link.click();
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box component="h5">Aggregated View</Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            select
            size="small"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="Business">Business</MenuItem>
            <MenuItem value="Targeting">Targeting</MenuItem>
            <MenuItem value="Ad Type">Ad Type</MenuItem>
          </TextField>
          <Button
            onClick={handleExport}
            style={{
              backgroundColor: "black",
              borderColor: "black",
            }}
            variant="contained"
          >
            Export
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box
          sx={{
            width: "100%",
            minHeight: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={48} />
        </Box>
      ) : (
        <AdvancedDataTable
          columns={columns}
          rows={filteredData}
          loading={loading}
          hideFooter={true}
          showExportButton={false}
          dynamicHeight={filteredData.length > 4 ? 300 : "auto"}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default AggregatedView;
