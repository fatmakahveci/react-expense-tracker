"use client";

import { FC } from "react";
import "./chart-bar.css";

type Props = {
    value: number;
    maxValue: number;
    label: string;
};

const ChartBar: FC<Props> = ({ value, maxValue, label }): React.JSX.Element => {
    let barFillHeight: string = '0%';

    if (maxValue > 0) {
        barFillHeight = `${Math.round((value / maxValue) * 100)}%`;
    }

    return (
        <div className="chart-bar" role="img" aria-label={`${label}: $${value.toFixed(2)}`} title={`${label}: $${value.toFixed(2)}`}>
            <div className="chart-bar__inner">
                <div className="chart-bar__fill" style={{ height: barFillHeight }}>
                </div>
            </div>
            <div className="chart-bar__label">{label}</div>
        </div>
    );
};

export default ChartBar;
