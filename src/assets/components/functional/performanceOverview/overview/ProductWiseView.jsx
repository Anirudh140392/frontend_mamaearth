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
    Typography,
} from "@mui/material";
import AdvancedDataTable from "../../../common/AdvancedDataTable";
import overviewContext from "../../../../../store/overview/overviewContext";
import { useSearchParams } from "react-router";

const HEADERS = [
    { key: "fsn_id", label: "FSN ID" },
    { key: "SKU_Name", label: "Product Name" },
    { key: "campaign_name", label: "Campaign Name" },
    { key: "Spend", label: "Spend" },
    { key: "Impressions", label: "Impressions" },
    { key: "Clicks", label: "Clicks" },
    { key: "Orders", label: "Orders" },
    { key: "Sales", label: "Sales" },
    { key: "ROAS", label: "ROAS" },
    { key: "CPC", label: "CPC" },
    { key: "CPM", label: "CPM" },
    { key: "CTR", label: "CTR" },
    { key: "ACOS", label: "ACOS" },
    { key: "CVR", label: "CVR" },
    
];

const ProductWiseView = () => {
    const { overviewData, overviewLoading } = useContext(overviewContext);
    const [filters, setFilters] = useState({
        range: "All",
        category: "All",
        subCategory: "All",
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const tableData = useMemo(() => {
        const products = overviewData?.prouct_Table || [];
        // Ensure we handle potential null/undefined values and unify keys if necessary
        return products.map(item => ({
            ...item,
            Range: item.Range || item.range || "",
            Category: item.Category || item.category || "",
            Sub_Category: item.Sub_Category || item.sub_category || item.SubCategory || ""
        }));
    }, [overviewData]);

    const filterOptions = useMemo(() => {
        const ranges = new Set(["All"]);
        const categories = new Set(["All"]);
        const subCategories = new Set(["All"]);

        // Ranges: Always show all unique ranges available in the dataset
        tableData.forEach((item) => {
            if (item.Range) ranges.add(item.Range);
        });

        // Categories: Show unique categories belonging to the selected Range
        tableData.forEach((item) => {
            if (filters.range === "All" || item.Range === filters.range) {
                if (item.Category) categories.add(item.Category);
            }
        });

        // Sub-Categories: Show unique sub-categories belonging to the selected Range AND Category
        tableData.forEach((item) => {
            const rangeMatch = filters.range === "All" || item.Range === filters.range;
            const categoryMatch = filters.category === "All" || item.Category === filters.category;
            if (rangeMatch && categoryMatch) {
                if (item.Sub_Category) subCategories.add(item.Sub_Category);
            }
        });

        return {
            ranges: Array.from(ranges).sort(),
            categories: Array.from(categories).sort(),
            subCategories: Array.from(subCategories).sort(),
        };
    }, [tableData, filters.range, filters.category]);

    // Cascading Reset Logic: If a selection is no longer valid in the new options list, reset it to "All"
    useEffect(() => {
        if (filters.category !== "All" && !filterOptions.categories.includes(filters.category)) {
            setFilters(prev => ({ ...prev, category: "All", subCategory: "All" }));
        }
    }, [filters.range, filterOptions.categories]);

    useEffect(() => {
        if (filters.subCategory !== "All" && !filterOptions.subCategories.includes(filters.subCategory)) {
            setFilters(prev => ({ ...prev, subCategory: "All" }));
        }
    }, [filters.range, filters.category, filterOptions.subCategories]);

    const filteredData = useMemo(() => {
        return tableData.filter((item) => {
            const rangeMatch = filters.range === "All" || item.Range === filters.range;
            const categoryMatch = filters.category === "All" || item.Category === filters.category;
            const subCategoryMatch = filters.subCategory === "All" || item.Sub_Category === filters.subCategory;
            return rangeMatch && categoryMatch && subCategoryMatch;
        });
    }, [tableData, filters]);


    const columns = useMemo(
        () =>
            HEADERS.map((h) => ({
                field: h.key,
                headerName: h.label.toUpperCase(),
                flex: 1,
                minWidth: h.key === "SKU_Name" || h.key === "campaign_name" ? 250 : 120,
                sortable: true,
                renderCell: (params) => {
                    const val = params.value;
                    if (typeof val === "number") {
                        return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
                    }
                    return val || "-";
                },
            })),
        []
    );

    const handleExport = () => {
        const headers = HEADERS.map((h) => h.label.toUpperCase());
        const rowsData = filteredData.map((row) => HEADERS.map((h) => row[h.key]));
        const csvContent = [headers, ...rowsData]
            .map((row) => row.map((v) => `"${v ?? ""}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "product_view_data.csv");
        link.click();
    };

    return (
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, mt: 3, mb: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h5" >Product View</Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                    <TextField
                        select
                        size="small"
                        label="Range"
                        value={filters.range}
                        onChange={(e) => setFilters({ ...filters, range: e.target.value })}
                        sx={{ minWidth: 150 }}
                    >
                        {filterOptions.ranges.map((opt) => (
                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        size="small"
                        label="Category"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        sx={{ minWidth: 150 }}
                    >
                        {filterOptions.categories.map((opt) => (
                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        size="small"
                        label="Sub-Category"
                        value={filters.subCategory}
                        onChange={(e) => setFilters({ ...filters, subCategory: e.target.value })}
                        sx={{ minWidth: 150 }}
                    >
                        {filterOptions.subCategories.map((opt) => (
                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                    </TextField>
                    <Button
                        onClick={handleExport}
                        variant="contained"
                        sx={{ backgroundColor: "black", "&:hover": { backgroundColor: "#333" } }}
                    >
                        Export
                    </Button>
                </Box>
            </Box>

            {overviewLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <AdvancedDataTable
                    columns={columns}
                    rows={filteredData}
                    loading={overviewLoading}
                    dynamicHeight={500}
                />
            )}


            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Card>
    );
};

export default ProductWiseView;
