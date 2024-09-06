import React from 'react';
import { Link } from 'react-router-dom';

const CityRow = ({ city }) => {
  return (
    <tr>
      <td>
        <Link to={`/weather/${city.name}`}>{city.name}</Link>
      </td>
      <td>{city.country}</td>
    </tr>
  );
};

export default CityRow;