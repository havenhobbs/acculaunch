import React from "react";

const Go_Nogo = ({ value }) => {

    const is_go = value >= 50;
    const status_text = is_go ? "GO" : "NO-GO";
    const status_class = is_go ? "go-widget" : "nogo-widget";

    return (

        <div className={`widget ${status_class}`}>
            <div className="widget-value">{status_text}</div>
        </div>

    );
};

export default Go_Nogo;