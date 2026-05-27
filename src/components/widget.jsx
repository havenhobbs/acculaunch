import React from "react";

const Widget = ({ title, children }) => {
    
    return (
        <div className="widget">
            <div className="widget-title">{title}</div>
            {children}
        </div>
    )
}

export default Widget;