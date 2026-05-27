import { useEffect, useState } from "react";
import { getForecast } from "../services/weather_service";
import Number from '../components/number';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css"



const thresholds = {
        wind_speed: 20,   //mph
        gust: 30,         //mph
        wind_shear: 10,   //mph difference
        visibility: 1000, //meters
        rain: 5           //mm per day
    };

function calculate_go_nogo({ wind_max, gust_max, wind_shear, visibility_min, rain_total }) {
    const reasons = [];

    if (wind_max > thresholds.wind_speed) reasons.push("Wind too high.");
    if (gust_max > thresholds.gust) reasons.push("Gust too high.");
    if (wind_shear > thresholds.wind_shear) reasons.push("Wind shear too high.");
    if (visibility_min !== null && visibility_min < thresholds.visibility) reasons.push("Visibility too low.");
    if (rain_total > thresholds.rain) reasons.push("Rain too heavy.");

    return { decision: reasons.length ? "NO-GO" : "GO", reasons};
}

const Forecast = ({ location }) => {

    const today = new Date();
    const localYMD = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    const [forecast, setForecast] = useState([]);
    const [missionDate, setMissionDate] = useState(localYMD);
    const [status, setStatus] = useState("Loading forecast...");
    

    useEffect(() => {

        if (!location) {
            setStatus("No location selected.");
            return;
        }

        if (!missionDate) {
            setStatus("No mission date selected.");
            return;
        }

        const fetchForecast = async () => {
            setStatus("Loading forecast...");

            try {

                const data = await getForecast(location.lat, location.lon);

                if (!data || !data.list) {
                    setStatus("Unable to load forecast.");
                    setForecast([]);
                    return;

                }

                //aggregate 3-hour intervals into daily summaries
                const grouped = {};
                data.list.forEach(item => {
                    const date = item.dt_txt.split(" ")[0];
                    if (!grouped[date]){
                        grouped[date] = { 
                            temps: [],
                            winds: [],
                            gusts: [],
                            humidities: [],
                            visibilities: [],
                            rains: [],
                            icons: []
                        };
                    }
                    grouped[date].temps.push(item.main.temp);
                    grouped[date].winds.push(item.wind.speed);
                    grouped[date].gusts.push((typeof item.wind.gust === "number") ? item.wind.gust : item.wind.speed);
                    grouped[date].humidities.push(item.main.humidity);
                    grouped[date].visibilities.push((typeof item.visibility === "number") ? item.visibility : null);
                    grouped[date].rains.push(item.rain?.["3h"] ?? item.rain?.["1h"] ?? 0);
                    grouped[date].icons.push(item.weather[0].icon);

                });

                const daily_summaries = Object.entries(grouped).map(([date, values]) => {
                    const wind_max = Math.max(...values.winds);
                    const gust_max = Math.max(...values.gusts);

                    const sum = arr => arr.reduce((a,b) => a + b, 0);
                    const mean = arr => arr.length ? sum(arr) / arr.length : null;

                    const wind_avg = mean(values.winds);
                    const gust_avg = mean(values.gusts);

                    const wind_shear = (typeof gust_max === "number" && typeof wind_max === "number") ? (gust_max - wind_max) : null;

                    const valid_vis = values.visibilities.filter(v => v !== undefined);
                    const visibility_min = valid_vis.length ? Math.min(...valid_vis) : null;

                    const rain_total = values.rains.reduce((a,b) => a + b, 0);

                    const humidities_avg = values.humidities.length ? Math.round(sum(values.humidities) / values.humidities.length) : null;

                    const temp_max = Math.max(...values.temps);
                    const temp_min = Math.min(...values.temps);
                    

                    const icon = values.icons.length ? values.icons[Math.floor(values.icons.length / 2)] : null;

                    const { decision, reasons } = calculate_go_nogo({ wind_max, gust_max, wind_shear, visibility_min, rain_total });

                    return {
                        date,
                        temp_min,
                        temp_max,
                        wind_avg,
                        wind_max,
                        gust_avg,
                        gust_max,
                        wind_shear,
                        visibility_min,
                        rain_total,
                        humidities_avg,
                        icon,
                        decision,
                        reasons

                    };
                });

                setForecast(daily_summaries);

                if (daily_summaries.length > 0 && !missionDate) {
                    setMissionDate(daily_summaries[0].date);
                }

                setStatus("");
            
            } catch (err) {
                console.error(err)
                setStatus("Error fetching forecast.");
                setForecast([]);
            }

        };

        fetchForecast();
    }, [location]);
        
    const displayedForecast = missionDate ? forecast.filter(f => f.date === missionDate) : forecast;
    
    return (
        <div className="forecast-page">
            <h1>Mission Weather Forecast</h1>

            <div className="mission-date-picker">
                <h2 className="mission-date-label">Choose Mission Date: </h2>

                <DatePicker
                    selected={
                        missionDate 
                        ? new Date(`${missionDate}T12:00:00`) 
                        : null
                    }
                    onChange={(date) => {
                        if (!date) return;

                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');

                        const ymd = `${year}-${month}-${day}`;
                        setMissionDate(ymd);

                    }}
                        
                    minDate={
                        forecast.length > 0 
                        ? new Date(`${forecast[0].date}T12:00:00`)
                        : null
                    }
                    maxDate={
                        forecast.length > 0 
                        ? new Date(`${forecast[forecast.length - 1].date}T12:00:00`)
                        : null
                    }
                    className="mission-date-picker-input"
                    calendarClassName="mission-calendar-dark"
                    popperClassName="mission-calendar-popper"
                    placeholderText="select a date"
                    showPopperArrow={false}
                />
            </div>
            
            {status && <p>{status}</p>}

            <div className="forecast-grid">
                {displayedForecast.length === 0 && !status && (
                    <p className="no-forecast-msg">
                        No forecast available for {missionDate || location?.name}. 
                    </p>
                )}

                {displayedForecast.map((day, idx) => (
                    <div key={idx} className="forecast-card">
                        <h3>{new Date(`${day.date}T12:00:00`).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            timeZone: "America/New_York"
                        })}</h3>

                        <div className="metric-grid">
                            <Number title="wind average" value={day.wind_avg !== null ? day.wind_avg.toFixed(2) : "-"} unit="mph" />
                            <Number title="gust average" value={day.gust_avg !== null ? day.gust_avg.toFixed(2) : "-"} unit="mph" />
                            <Number title="wind shear" value={day.wind_shear !== null ? day.wind_shear.toFixed(2) : "-"} unit="mph" />

                            <Number title="visibility" value={day.visibility_min ? day.visibility_min.toLocaleString() : "-"} unit="m" />
                            <Number title="rain" value={day.rain_total !== undefined ? day.rain_total.toFixed(2) : "-"} unit="mm" />
                            <Number title="humidity" value={day.humidities_avg !== null ? day.humidities_avg : "-"} unit="%" />

                            <Number title="wind max" value={day.wind_max !== undefined ? day.wind_max.toFixed(2) : "-"} unit="mph" />
                            <Number title="gust max" value={day.gust_max !== undefined ? day.gust_max.toFixed(2) : "-"} unit="mph" />
                            <Number title="temp max" value={day.temp_max !== undefined ? day.temp_max.toFixed(2) : "-"} unit="°C" />


                        </div>

                        <div className="decision-card">

                            <p className={day.decision === 'GO' ? "go-badge" : "no-go-badge"}>
                            {day.decision}
                            </p>

                            {day.reasons.length > 0 && (
                                <ul className="reasons-list">
                                    {day.reasons.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            )}
                        </div>
                    </div>

                ))}

            </div>
        
        </div>
    );
};

export default Forecast;