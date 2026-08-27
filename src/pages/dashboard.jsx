import React, { useEffect, useState } from "react";
import Widget from '../components/widget';
import Number from '../components/number';
import Go_Nogo from "../components/go_nogo";

import { getWeather, getLaunchStatus } from "../services/weather_service";
import "../App.css";




const Dashboard = ({ location }) => {

    const [weather, setWeather] = useState(null);
    const [launch, setLaunch] = useState(null);

    const format_num = (value) => {
        if (value === null || value === undefined) return "-";
        return parseFloat(value).toFixed(2);
    }


    useEffect(() => {
        if (!location) return;

        getWeather(location.lat, location.lon)
            .then(data => {
                console.log("Weather data: ", data);
                setWeather(data);
            })
            .catch(err => console.error("Weather fetch error: ", err));

        getLaunchStatus(location.lat, location.lon)
            .then(data => {
                console.log("Launch data: ", data);
                setLaunch(data);
            })
            .catch(err => console.error("Launch fetch error: ", err));
    }, [location]);


    if (!weather || !launch || !weather.temperature || !launch.reasons){
        console.log("Weather:", weather);
        console.log("Launch", launch);
        
        return <p>Loading...</p>;
    }

    const wind_shear = weather.wind_gust && weather.wind_speed
        ? format_num(weather.wind_gust - weather.wind_speed) : 0;

    return (

        <div className="dashboard">
            <h1>Acculaunch Dashboard</h1>
        

            <div className="widget-grid">

                <Number title='wind speed' value={format_num(weather.wind_speed)} unit='mph' />
                <Number title='gust' value={format_num(weather.wind_gust)} unit='mph' />
                <Number title='wind shear' value={wind_shear} unit='mph' />
                
                <Number title='visibility' value={launch.visibility ? launch.visibility.toLocaleString() : "0:"} unit='m' />
                <Number title='rain' value={format_num(weather.rain)} unit="mm" />
                <Number title='humidity' value={weather.humidity || 0} unit="%" />

                <div className="go-nogo-full">
                     <Go_Nogo value={launch.decision === "GO" ? 100 : 0} />
                </div>
               
            </div>

            <div className="reasons-container">
                <div className="reasons-widget">
                    <h2>NO-GO Reasons</h2>
                    <ul>
                        {launch.reasons.map((reason, i) => (
                            <li key={i}>{reason}</li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;