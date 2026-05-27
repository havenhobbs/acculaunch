import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const WeatherCharts = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {

                const response = await fetch("http://127.0.0.1:5000/api/weather-history");
                const data = await response.json();

                if (Array.isArray(data)) {
                    setHistory(prev => {
                        const combined = [...prev, ...data];
                        const unique = Array.from(new Map(combined.map(item => [item.timestamp, item])).values());
                        return unique.slice(-50);
                    });
                } 

            } catch (err) {
                console.error("Failed to load weather history.", err);
            }
        };

    fetchHistory();

    const interval = setInterval(fetchHistory, 15000);

    return () => clearInterval(interval);
}, []);

    const formattedData = [...history]
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(entry => ({
        time: new Date(entry.timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        temperature: entry.temperature,
        humidity: entry.humidity,
        wind_speed: entry.wind_speed,
        cloud_cover: entry.cloud_cover
    }));

    if (formattedData.length === 0) {
        return (
            <div className="chart-container">
                <h2>Weather Trends</h2>
                <p>Loading weather data... Please wait for the first fetch.</p>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h2>Weather Trends</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#82ca9d" name="Temperature (°C)" />
                    <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#8884d8" name="Humidity (%)" />
                    <Line yAxisId="left" type="monotone" dataKey="wind_speed" stroke="#ffc658" name="Wind Speed (m/s)" />
                    <Line yAxisId="left" type="monotone" dataKey="cloud_cover" stroke="#ff7300" name="Cloud Cover (%)" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeatherCharts;