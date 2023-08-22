"use client";

import { FC } from "react";
import ChartBar from "./ChartBar";
import "./Chart.css";
import { DataPoint } from "@/shared/types/Types";

const Chart: FC<{ dataPoints: DataPoint[] }> = ({ dataPoints }): JSX.Element => {
    const dataPointValues = dataPoints.map(dataPoint => dataPoint.value);
    const totalMaximum = Math.max(...dataPointValues);

    return (
        <div className="chart">
            {dataPoints.map((dataPoint: DataPoint) => (
                <ChartBar
                    key={dataPoint.label}
                    value={dataPoint.value}
                    maxValue={totalMaximum}
                    label={dataPoint.label} />
            ))
            }
        </div>
    );
};

export default Chart;
