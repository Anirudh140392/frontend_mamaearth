import React from "react";
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LabelList
} from "recharts";

const TrendsComposedChart = ({ data, dates, bids, metric1, metric2 }) => {

    const formatNumber = (num) => {
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
        if (num >= 100_000) return (num / 100_000).toFixed(1) + "L";
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
        return num;
    };

    const chartData = dates.map((date, index) => ({
        date,
        bid: bids[index],
        metric1: data[metric1]?.[index] ?? null,
        metric2: data[metric2]?.[index] ?? null
    }));

    return (
        <ResponsiveContainer width="100%" height={590}>
            <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis yAxisId="left" orientation="left" stroke="#007bff" tickFormatter={formatNumber} />
                <YAxis yAxisId="right" orientation="right" stroke="#ffa500" tickFormatter={formatNumber} />

                <Tooltip formatter={(value, name) => [formatNumber(value), name === "metric1" ? metric1 : metric2]} />
                <Legend formatter={(value) => value === "metric1" ? metric1 : metric2} />

                <Bar yAxisId="left" dataKey="metric1" fill="#007bff">
                    <LabelList dataKey="bid" position="top" formatter={(value) => `Bid: ${formatNumber(value)}`} />
                </Bar>

                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="metric2"
                    stroke="#ffa500"
                    dot={{ r: 5 }}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default TrendsComposedChart;

