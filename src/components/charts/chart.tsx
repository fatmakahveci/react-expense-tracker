"use client";

import { FC } from "react";
import ChartBar from "@/components/charts/chart-bar";
import "./chart.css";
import { DataPoint } from "@/components/charts/types";

const Chart: FC<{ dataPoints: DataPoint[] }> = ({ dataPoints }): React.JSX.Element => {
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
