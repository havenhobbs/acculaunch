export async function getWeather(lat, lon) {

    try {

        const res = await fetch(
            `http://127.0.0.1:5000/api/weather?lat=${lat}&lon=${lon}`);
        if (!res.ok) throw new Error("Weather API response not OK");
        return await res.json();
    } catch (err) {
        console.error("Weather API Error: ", err)
        return null;
    }
    
}

export async function getLaunchStatus(lat, lon) {

    try {

        const res = await fetch(
            `http://127.0.0.1:5000/api/launch/status?lat=${lat}&lon=${lon}`);
        if (!res.ok) throw new Error("Launch Status API response not OK");
        return await res.json();
    } catch (err) {
        console.error("Launch Status API Error: ", err)
        return null;
    }
    
}

export async function getForecast(lat, lon) {
    try {
        const res = await fetch(
            `http://127.0.0.1:5000/api/forecast?lat=${lat}&lon=${lon}`
        );
        if (!res.ok) throw new Error("Forecast API response not OK");
        return await res.json();
    } catch (err) {
        console.error("Forecast Status API Error: ", err);
        return null;
    }
}