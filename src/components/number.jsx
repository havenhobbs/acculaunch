import React from "react";
import { ResponsiveContainer } from "recharts";

const Number = ({ title, value, unit }) => {
    return (
        <div className="widget">
            
            <div className="widget-value">
                {value}{unit && <span className="unit"> {unit}</span>}

                {title && <div className="widget-title">{title}</div>}
            </div>
 
        </div>
    );
};

export default Number;