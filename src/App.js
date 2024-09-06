import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CitiesTable from './components/CitiesTable';
import WeatherDetails from './components/WeatherDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CitiesTable />} />
      <Route path="/weather/:cityName" element={<WeatherDetails />} />
    </Routes>
  );
}

export default App;