import React from "react";
import { FunnelChart, Funnel, LabelList, ResponsiveContainer } from "recharts";

const OverviewFunnelChart = ({ data }) => {

    const formatNumber = (num) => {
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
        if (num >= 100_000) return (num / 100_000).toFixed(1) + "L";
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
        return num;
    };

    if (!data || !Array.isArray(data) || data.length === 0) {
        return;
    }
    const proportions = [100, 80, 50, 40, 26];
    const processedData = data.map((item, index) => ({
        ...item,
        scaledValue: proportions[index] || 26,
        formattedValue: formatNumber(item.value)
    }));

    return (
        <div style={{ width: 300, height: 400, margin: "auto" }}>
            <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                    <Funnel dataKey="scaledValue" data={processedData} isAnimationActive>
                        <LabelList position="center" fontSize='12px' fill="#fff" stroke="none" dataKey="name" />
                        <LabelList position="center" dy={15} fontSize='12px' fill="#fff" stroke="none" dataKey="formattedValue" />
                    </Funnel>
                </FunnelChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OverviewFunnelChart;