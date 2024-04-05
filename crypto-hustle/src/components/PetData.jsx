import React from 'react';
import './PetData.css';

function PetData({ data }) {
  return (
    <div className="pet-data-container">
      {data && data.animals && data.animals.map((animal, index) => (
        <div className="pet-card">
          {animal.photos[0] && <img src={animal.photos[0].small} alt={animal.name} />}
          <div>
            <h2>{animal.name}</h2>
            <p>{animal.breeds.primary}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PetData;