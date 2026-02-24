import React, { useState, useEffect, useContext } from "react";
import ChartComponent from "../../../common/chartComponent";
import ButtonComponent from "../../../molecules/buttonComponent";
import MuiDataTableComponent from "../../../common/muidatatableComponent";
import Typography from '@mui/material/Typography';
import AddGoalModal from "../modal/addGoalModal";
import overviewContext from "../../../../../store/overview/overviewContext";
import { useSearchParams } from "react-router-dom";

const GoalComponent = () => {
    const dataContext = useContext(overviewContext)
    const { dateRange, formatDate } = dataContext
    const [searchParams] = useSearchParams();
    const operator = searchParams.get("operator");
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [goalChartData, setGoalChartData] = useState([
        ["Data", "Number"],
        ["Achieved", 0],
        ["Not Achieved", 0],
    ]);
    const [isLoading, setIsLoading] = useState(false)
    const [goalTableData, setGoalTableData] = useState([]);

    const pieChartOptions = {
        curveType: "function",
        pieHole: 0.5,
        legend: { position: "bottom" },
        'chartArea': { 'width': '85%' }
    }

    const GoalViewColumn = [
        { field: 'goal_name', headerName: 'GOAL NAME', width: 150 },
        { field: 'metric_unit', headerName: 'METRIC UNIT', width: 150 },
        { field: 'target', headerName: 'TARGET', width: 150 },
        { field: 'achivement', headerName: 'ACHIEVEMENT', width: 150 },
        { field: 'achivement_percent', headerName: '% ACHIEVEMENT', width: 150 },
        {
            field: 'goal_status',
            headerName: 'GOAL STATUS',
            width: 150,
            renderCell: (params) => (
                <Typography sx={{ height: "100%", display: "flex", alignItems: "center" }} color={`${params.row.goal_status === "Achieved" ? "success" : "error"}`}>{params.row.goal_status}</Typography>
            ),
        },
    ];

    useEffect(() => {
        const fetchGoalStats = async () => {
            const startDate = formatDate(dateRange[0].startDate);
            const endDate = formatDate(dateRange[0].endDate);
            setIsLoading(true);
            try {
                const accessToken = localStorage.getItem("accessToken");

                const response = await fetch(
                    `https://react-api-script.onrender.com/app/achieved-goals-count?start_date=${startDate}&end_date=${endDate}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                const data = result.data;

                const updatedChartData = [
                    ["Data", "Number"],
                    ["Achieved", data["Achieved goals"]],
                    ["Not Achieved", data["Unachieved goals"]],
                ];
                setGoalChartData(updatedChartData);
            } catch (error) {
                console.error("Failed to fetch goal stats:", error);
            } finally {
                setIsLoading(false)
            }
        };
        const fetchGoalTableData = async () => {
            const startDate = formatDate(dateRange[0].startDate);
            const endDate = formatDate(dateRange[0].endDate);
            setIsLoading(true);
            try {
                const accessToken = localStorage.getItem("accessToken");

                const response = await fetch(
                    `https://react-api-script.onrender.com/app/display-goals?start_date=${startDate}&end_date=${endDate}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const result = await response.json();
                const goalData = result.data.map((goal, index) => ({
                    id: index + 1,
                    goal_name: goal.goal_name,
                    metric_unit: goal.metric,
                    target: goal.metric_value,
                    achivement: goal.achievement,
                    achivement_percent: goal.Achievement_Percentage,
                    goal_status: goal.status,
                }));

                setGoalTableData(goalData);
            } catch (error) {
                console.error("Failed to fetch goal table data:", error);
            } finally {
                setIsLoading(false)
            }
        };

        fetchGoalStats();
        fetchGoalTableData();
    }, [operator, dateRange]);

    return (
        <React.Fragment>
            <AddGoalModal
                showGoalModal={showGoalModal}
                setShowGoalModal={setShowGoalModal} />
            <div className="shadow-box-con top-overview-con">
                <div className="px-3 py-2 border-bottom">
                    <div className="row">
                        <div className="col-lg-6">
                            <h5 className="mb-0">Goals</h5>
                        </div>
                        <div className="col-lg-6 text-end">
                            <ButtonComponent
                                buttonClass="btn btn-sm btn-primary me-3"
                                buttonLabel="Add Goal"
                                onClick={() => setShowGoalModal(true)} />
                        </div>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <div className="row">
                        <div className="col-lg-3">
                            <ChartComponent
                                chartType={'PieChart'}
                                chartData={goalChartData}
                                chartWidth={"100%"}
                                chartHeight="350px"
                                options={pieChartOptions} />
                        </div>
                        <div className="col-lg-9">
                            <div className="datatable-con-overview">
                                <MuiDataTableComponent
                                    isLoading={isLoading}
                                    columns={GoalViewColumn}
                                    isExport={true}
                                    data={goalTableData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )

}

export default GoalComponent;