/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CityRow from './CityRow';
import LoadingSpinner from './LoadingSpinner';
import useDebounce from '../hooks/useDebounce';

const API_URL = 'https://public.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000/api/';
const LIMIT = 20;

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchCities = async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?offset=${offset}&limit=${LIMIT}`);
      const newCities = response.data.records;

      setCities((prev) => [...prev, ...newCities]);
      setOffset((prev) => prev + LIMIT);
      setHasMore(newCities.length === LIMIT);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight * 0.8) {
        fetchCities();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filteredCities = cities.filter(city =>
        city.fields.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setCities(filteredCities);
    } else {
      setCities([]);
      fetchCities();
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <h1>Cities List</h1>
      <input
        type="text"
        placeholder="Search cities..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>City Name</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <CityRow key={city.recordid} city={city.fields} />
          ))}
        </tbody>
      </table>
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default CitiesTable;