import React from "react";
import { Chart } from 'react-google-charts';

const ChartComponent = (props) => {

    const {chartData,
        chartType,
        chartWidth,
        chartHeight,
        options} = props;

    return(
        <React.Fragment>
            <Chart
                chartType={chartType}
                data={chartData}
                width={chartWidth}
                height={chartHeight}
                options={options}
            />
        </React.Fragment>
    )
}

export default ChartComponent;