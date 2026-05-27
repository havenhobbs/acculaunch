import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LOCATIONS } from './constants/locations';

import Dashboard from './pages/dashboard';
import Forecast from './pages/forecast';
import About from './pages/about';

import './App.css';

function App() {

  const [location, setLocation] = useState(LOCATIONS[0].name);

  return (

    <Router>

      <nav style={{display: 'flex', gap: '1rem', padding: '1rem'}}>
        <Link to='/'>dashboard</Link>
        <Link to='/forecast'>forecast</Link>
        <Link to='/about'>our mission</Link>

        <select 
        value={location} 
        onChange={(e) => setLocation(e.target.value)}
        style={{ marginLeft: 'auto', padding: '0.5rem' }}
        >
          {LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
      </nav>

      <Routes>
        <Route path='/' element={<Dashboard location={LOCATIONS.find(l => l.name === location)} />} />
        <Route path='/forecast' element={<Forecast location={LOCATIONS.find(l => l.name === location)} />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </Router>

  );
};

export default App;