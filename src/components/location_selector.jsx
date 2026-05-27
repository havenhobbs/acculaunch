import React from "react";
import { LOCATIONS } from "../constants/locations";

const LocationSelector = ({ selectedLocation, onChange }) => {

    return (

        <select value={selectedLocation} onChange={(e) => onChange(e.target.value)}
            className="p-2 rounded border"
        >
            {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.name}>
                    {loc.name}
                </option>
            ))}
        </select>

    );
};

export default LocationSelector;