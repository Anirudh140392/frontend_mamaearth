import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Dropdown, Spinner, Alert } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FiRefreshCw } from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useSearchParams } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../../assets/styles/goals/goalService.less";
import AddEditGoal from "./AddEditGoal";
import overviewContext from "../../../../../store/overview/overviewContext";
import AdvancedDataTable from "../../../common/AdvancedDataTable";

ChartJS.register(ArcElement, Tooltip, Legend);

const GoalsOverview = () => {
    const [rows, setRows] = useState([]);
    const [allGoalsData, setAllGoalsData] = useState([]);
    const [filter, setFilter] = useState("Active");
    const [loading, setLoading] = useState(false);
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");
    const { formatDate, dateRange, refreshTrigger, refreshAll } = useContext(overviewContext);

    const fetchGoalsData = async () => {
        if (!operator) return;

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("accessToken");
            const url = `https://react-api-script.onrender.com/goalsengine/goals/list?platform=${operator}&brand=mamaearth`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || `Failed to fetch goals data: ${response.status}`;
                setError(errorMessage);
                return;
            }

            const data = await response.json();
            const goalsList = data?.data?.goals || data?.goals || [];
            const mappedGoals = goalsList.map((goal) => ({
                id: goal.id,
                uuid: goal.uuid,
                goalName: goal.goal_name,
                metricUnit: goal.metric_name,
                target: goal.metric_value?.toString() || "0",
                achievement: goal.actual_value?.toString() || "0",
                percent: `${(goal.achievement_percentage || 0).toFixed(2)}%`,
                status: goal.status === "ACHIEVED" ? "Achieved" : "Not Achieved",
                dataLevel: goal.data_level,
                dataOperator: goal.data_operator,
                dataValues: goal.data_values,
                priority: goal.priority_label,
            }));
            setAllGoalsData(mappedGoals);
            setRows(mappedGoals);
        } catch (error) {
            console.error("Error fetching goals data:", error);
            setAllGoalsData([]);
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoalsData();
    }, [operator, refreshTrigger]);

    const handleRefresh = () => {
        if (refreshAll) {
            refreshAll();
        } else {
            fetchGoalsData();
        }
    };

    const filteredRows = rows.filter((row) => {
        if (filter === "Active")
            return row.status === "Achieved" || row.status === "Not Achieved";
        return row.status === filter;
    });

    const chartData = {
        labels: ["Achieved", "Not Achieved"],
        datasets: [
            {
                data: [
                    filteredRows.filter((r) => r.status === "Achieved").length,
                    filteredRows.filter((r) => r.status === "Not Achieved").length,
                ],
                backgroundColor: ["#28a745", "#dc3545"],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: { boxWidth: 12, padding: 10 },
            },
        },
    };

    const columns = [
        { field: "goalName", headerName: "GOAL NAME", flex: 1 },
        { field: "metricUnit", headerName: "METRIC UNIT", flex: 1 },
        { field: "target", headerName: "TARGET", flex: 1 },
        { field: "achievement", headerName: "ACHIEVEMENT", flex: 1 },
        { field: "percent", headerName: "% ACHIEVEMENT", flex: 1 },
        {
            field: "status",
            headerName: "GOAL STATUS",
            flex: 1,
            renderCell: (params) => (
                <span
                    className={
                        params.value === "Achieved" ? "status-achieved" : "status-not"
                    }
                >
                    {params.value}
                </span>
            ),
        },
    ];

    const handleExport = () => {
        const exportData = filteredRows.map(
            ({ goalName, metricUnit, target, achievement, percent, status }) => ({
                "GOAL NAME": goalName,
                "METRIC UNIT": metricUnit,
                TARGET: target,
                ACHIEVEMENT: achievement,
                "% ACHIEVEMENT": percent,
                "GOAL STATUS": status,
            })
        );

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Goals");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "goals_overview.xlsx");
    };

    return (
        <Card className="goals-card p-3">
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    <strong>Error loading goals:</strong> {error}
                </Alert>
            )}
            <div className="d-flex justify-content-between align-items-center mb-3 goals-header flex-wrap">
                <h5>Goals Overview</h5>
                <div className="d-flex gap-2 align-items-center flex-wrap">
                    <Dropdown>
                        <Dropdown.Toggle variant="light" className="dropdown-btn">
                            {filter}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {["Active", "Achieved", "Not Achieved"].map((status) => (
                                <Dropdown.Item key={status} onClick={() => setFilter(status)}>
                                    {status}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Button variant="light" onClick={handleRefresh}>
                        {loading ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            <FiRefreshCw />
                        )}
                    </Button>

                    <Button variant="primary" onClick={() => setShowAddGoal(true)}>
                        Add Goal
                    </Button>

                    <AddEditGoal
                        show={showAddGoal}
                        onClose={() => setShowAddGoal(false)}
                        onSubmit={() => {
                            fetchGoalsData();
                        }}
                        operator={operator}
                    />

                    <Button
                        variant="dark"
                        onClick={handleExport}
                        style={{
                            backgroundColor: "black",
                            borderColor: "black",
                        }}
                    >
                        Export
                    </Button>
                </div>
            </div>
            <div className="d-flex flex-wrap gap-4 goals-content">
                <div
                    className="chart-section"
                    style={{
                        flex: "1 1 250px",
                        minWidth: 250,
                        maxWidth: 400,
                        height: 250,
                        position: "relative",
                    }}
                >
                    <Doughnut data={chartData} options={chartOptions} />
                </div>

                <div className="table-section flex-grow-1" style={{ minWidth: 300 }}>
                    <AdvancedDataTable
                        columns={columns}
                        rows={filteredRows}
                        loading={loading}
                        hideFooter={true}
                        showExportButton={false}
                        dynamicHeight={filteredRows.length > 5 ? 330 : "auto"}
                    />
                </div>
            </div>
        </Card>
    );
};

export default GoalsOverview;
