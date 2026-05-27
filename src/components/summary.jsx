import React from "react";

const Summary = ({ weather }) => {

    return (
        <div className="summary-card">
            <h2 className="text-lg font-bold">conditions summary</h2>

            <div className="widget-grid-summary">
                <div className="widget-summary">
                    
                    <p>{weather.temp}°F</p>
                    <h3 className="widget-title">temperature</h3>
            </div>

            <div className="widget-summary">
                
                <p>{weather.go_nogo}</p>
                <p className="widget-title">go / no-go</p>
            </div>

            <div className="widget-summary">
                
                <p>{weather.wind_speed} mph</p>
                <p className="widget-title">wind speed</p>
            </div>

            <div className="widget-summary">
                
                <p>{weather.wind_dir}</p>
                <p className="widget-title">wind direction</p>
            </div>

            <div className="widget-summary">
                
                <p>{weather.rainfall} %</p>
                <p className="widget-title">rainfall</p>
            </div>

            <div className="widget-summary">
                
                <p>{weather.cloud_cover} %</p>
                <p className="widget-title">cloud cover</p>
            </div>

            
        </div>

        </div>
    );
};

export default Summary;