import React, { useState, useContext, useEffect, useRef } from "react";
import PencilEditIcon from "../../../icons/common/pencilEditIcon";
import MuiDataTableComponent from "../../common/muidatatableComponent";
import overviewContext from "../../../../store/overview/overviewContext";
import { useSearchParams } from "react-router";
import ColumnPercentageDataComponent from '../../common/columnPercentageDataComponent';
import Typography from '@mui/material/Typography';
import { Switch, Box, Button, CircularProgress } from "@mui/material";
import NewPercentageDataComponent from "../../common/newPercentageDataComponent";
//import EditIcon from '@mui/icons-material/Edit';
//import {  TextField, IconButton} from "@mui/material";

const AdGroupsComponent = () => {
    //const [statusToggle, setStatusToggle] = useState(true)
    const { dateRange, formatDate } = useContext(overviewContext);
    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");

    const [updatingStatus, setUpdatingStatus] = useState({});

    const [AdGroupData, setAdGroupData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    /* const [editRowId, setEditRowId] = useState(null);
    const [editedName, setEditedName] = useState("");*/

    const abortControllerRef = useRef(null);

    const fetchAdGroupsData = async () => {
        if (!operator) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("Missing access token");
            setIsLoading(false);
            return;
        }

        const startDate = formatDate(dateRange[0].startDate);
        const endDate = formatDate(dateRange[0].endDate);

        try {
            const response = await fetch(
                `https://react-api-script.onrender.com/mamaearth/adgroups?start_date=${startDate}&end_date=${endDate}&platform=Amazon`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal,
                }
            );

            if (!response.ok) throw new Error("Failed to fetch keyword data");

            const result = await response.json();
           
            setAdGroupData(result.data || []);

        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Error fetching keyword data:", error);
                setAdGroupData([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchAdGroupsData();
        }, 100);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            clearTimeout(timeout);
        }
    }, [operator, dateRange]);

    const handleToggle = async (campaignType, adGroupId, campaignId) => {
        const token = localStorage.getItem("accessToken");
        setUpdatingStatus(prev => ({ ...prev, [adGroupId]: true, [campaignType]: true, [campaignId]: true }));
        try {
            const params = new URLSearchParams({
                campaign_type: campaignType,
                ad_group_id: adGroupId,
                platform: operator,
                campaign_id: campaignId
            });
            const response = await fetch(`https://react-api-script.onrender.com/mamaearth/toggle_ad_group?${params.toString()}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                 });

            if (!response.ok) throw new Error("Failed to update adgroup status");

            // Update local state
             setAdGroupData(prev =>
                prev.map(row =>
                    row.ad_group_id === adGroupId && row.campaign_id === campaignId && row.campaign_type === campaignType ? { ...row, status: row.status === 1 ? 0 : 1 } : row
                )
            );
           
        } catch (err) {
            console.error("Error updating adgroup status:", err);
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [adGroupId]: false, [campaignType]: false, [campaignId]: false }));
        }
    };

    /*const handleEditClick = (row) => {
        setEditRowId(row.ad_group_id);
        setEditedName(row.ad_group_name);
    };

    const handleUpdateName = async (row) => {
        setEditRowId(null); // Exit edit mode
        const token = localStorage.getItem("accessToken");
        if (!token || editedName.trim() === "" || editedName === row.ad_group_title) return;

        try {
            const response = await fetch(`https://react-api-script.onrender.com/bowlers/update_ad_group_name?platform=Amazon&ad_group_id=${row.ad_group_id}&campaign_type=${encodeURIComponent(row.campaign_type)}&campaign_id=${row.campaign_id}&new_name=${encodeURIComponent(editedName)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
                }

            const result = await response.json();

            setAdGroupData((prevData) =>
                prevData.map((adGroup) =>
                    adGroup.ad_group_id === row.ad_group_id
                        ? {
                            ...adGroup,
                            ad_group_name: result.adGroups.success[0].adGroup.name,
                        }
                        : adGroup
                )
            );
        } catch (error) {
            console.error("Failed to update ad group name:", error.message);
        }
    };*/

    const AdGroupsViewColumn = [
        {
            field: "ad_group_name",
            headerName: "AD GROUP",
            width: 150,
            align: "left",
            headerAlign: "left",
            /*renderCell: (params) => {
    const isEditing = params.row.ad_group_id === editRowId;

    return (
      <div className="d-flex align-items-center">
        {isEditing ? (
          <TextField
            autoFocus
            value={editedName}
            size="small"
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={() => handleUpdateName(params.row)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleUpdateName(params.row);
              }
            }}
          />
        ) : (
       <>
            <Typography variant="body2">{params.row.ad_group_name}</Typography>
            <IconButton onClick={() => handleEditClick(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </div>
    );
  },*/
                 
        },
        {
            field: "status",
            headerName: "STATUS",
            width: 100,
            renderCell: (params) => {
                if (updatingStatus[params.row.campaign_type] && updatingStatus[params.row.ad_group_id] && updatingStatus[params.row.campaign_id]) {
                    return <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}><CircularProgress size={24} /></Box>
                }
                return (<Switch
                    checked={params.row.status === 1}
                    onChange={() => handleToggle(params.row.campaign_type, params.row.ad_group_id, params.row.campaign_id)}
                />)
            }
        },
        {

            field: "campaign_name",
            headerName: "CAMPAIGN",
            width: 220,
            align: "left",
            headerAlign: "left"
        },
        {
            field: "spend_curr",
            headerName: "SPENDS",
            width: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.spend_curr}
                    percentValue={params.row.spend_diff}
                />
            )
        },
        {
            field: "sales_curr",
            headerName: "SALES",
            width: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.sales_curr}
                    percentValue={params.row.sales_diff}
                />
            )
        },
        {
            field: "impressions_curr",
            headerName: "IMPRESSIONS",
            width: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.impressions_curr}
                    percentValue={params.row.impressions_diff}
                />
            )
        },
         {
            field: "clicks_curr",
            headerName: "CLICKS",
            width: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.clicks_curr}
                    percentValue={params.row.clicks_diff}
                />
            )
        },
        {
            field: "orders_curr",
            headerName: "ORDERS",
            width: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.orders_curr}
                    percentValue={params.row.orders_diff}
                />
            )
        },
        {
            field: "ctr_curr",
            headerName: "CTR",
            width: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <NewPercentageDataComponent
                    firstValue={params.row.ctr_curr}
                    secValue={params.row.ctr_diff}
                />
            )
        },
        {
            field: "cpc_curr",
            headerName: "CPC",
            width: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.cpc_curr}
                    percentValue={params.row.cpc_diff}
                />
            )
        },
        {
            field: "cvr_curr",
            headerName: "CVR",
            width: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <NewPercentageDataComponent
                    firstValue={params.row.cvr_curr}
                    secValue={params.row.cvr_diff}
                />
            )
        },
        {
            field: "roas_curr",
            headerName: "ROAS",
            width: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.roas_curr}
                    percentValue={params.row.roas_diff}
                />
            )
        },
        {
            field: "acos_curr",
            headerName: "ACOS",
            width: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <NewPercentageDataComponent
                    firstValue={params.row.acos_curr}
                    secValue={params.row.acos_diff}
                />
            )
        },
        {
            field: "aov_curr",
            headerName: "AOV",
            width: 150,
            type: "number",
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <ColumnPercentageDataComponent
                    mainValue={params.row.aov_curr}
                    percentValue={params.row.aov_diff}
                />
            )
        },
    ];

    return (
        <React.Fragment>
            <div className="shadow-box-con-keywords aggregated-view-con">
                <div className="datatable-con-keywords">
                    <MuiDataTableComponent
                        isLoading={isLoading}
                        isExport={true}
                        columns={AdGroupsViewColumn}
                        data={AdGroupData || []} />
                </div>
            </div>
        </React.Fragment>
    );
};

export default AdGroupsComponent;

