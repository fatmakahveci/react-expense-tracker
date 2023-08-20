"use client";

import React from "react";
import ChartBar from "./ChartBar";
import "./Chart.css";

type Props = {
    dataPoints: any;
};

const Chart: React.FC<Props> = ({ dataPoints }) => {

    return (
        <div className="chart">
            {dataPoints.map((dataPoint: any) => (
                <ChartBar
                    key={dataPoint.label}
                    value={dataPoint.value}
                    maxValue={dataPoint.maxValue}
                    label={dataPoint.label} />))
            }
        </div>
    );
};

export default Chart;
