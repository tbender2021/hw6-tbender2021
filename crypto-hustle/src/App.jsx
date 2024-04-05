import React, { useState, useEffect } from 'react';
import getAccessToken from './components/token.jsx';
import PetData from './components/PetData.jsx';
import SideNav from "./components/SideNav";
import './App.css';

function App({ searchInput }) {
  const [data, setData] = useState({ animals: [], totalDogs: 0, topBreeds: [], ageCounts: {} });

  useEffect(() => {
    const fetchAllPetsData = async () => {
      try {
        const accessToken = await getAccessToken();
        let allAnimals = [];

        for (let i = 1; i <= 3; i++) {
          const url = `https://api.petfinder.com/v2/animals?type=dog&page=${i}`;

          const response = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();
          allAnimals = [...allAnimals, ...data.animals];
        }

        // Filter out dogs without images
        allAnimals = allAnimals.filter(animal => animal.photos.length > 0);

        // Total number of dogs
        const totalDogs = allAnimals.length;

        // Number of dogs by breed
        const breedCounts = allAnimals.reduce((counts, animal) => {
          const breed = animal.breeds.primary;
          counts[breed] = (counts[breed] || 0) + 1;
          return counts;
        }, {});
        const topBreeds = Object.entries(breedCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

        // Count of dogs in each age group
        const ageCounts = allAnimals.reduce((counts, animal) => {
          const ageGroup = animal.age;
          counts[ageGroup] = (counts[ageGroup] || 0) + 1;
          return counts;
        }, {});

        setData({ animals: allAnimals, totalDogs, topBreeds, ageCounts });
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    };

    fetchAllPetsData();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAnimals, setFilteredAnimals] = useState([]);

  const searchItems = searchValue => {
    setSearchTerm(searchValue);
    if (searchValue !== "") {
      const filteredData = data.animals.filter((animal) => { 
        return animal.breeds.primary.toLowerCase().includes(searchValue.toLowerCase())

    })
      setFilteredAnimals(filteredData);
    } else {
      setFilteredAnimals(data);
    }
  };

  // Call searchItems whenever searchTerm changes
  useEffect(() => {
    searchItems(searchTerm);
  }, [searchTerm]);

  return (
    <div>
      <div class="SideNav">
      <SideNav />
      </div>
      <h1>DogDash </h1>

      <div className="search-container">
  <div>
    <h2>Search by breed</h2>
    <form>
      <input
        type="search"
        id="search-bar"
        className="search-bar"
        placeholder="Search..."
        onChange={(inputString) => searchItems(inputString.target.value)}
      />
      <button type="submit">Go</button>
    </form>
  </div>
  <div>
    <h2>Search by age</h2>
    <form>
      <select
        id="search-bar"
        className="search-bar"
        onChange={(event) => searchItems(event.target.value)}
      >
        <option value="">Select age...</option>
        <option value="young">Young</option>
        <option value="adult">Adult</option>
        <option value="old">Old</option>
        {/* Add more options as needed */}
      </select>
      <button type="submit">Go</button>
    </form>
  </div>
</div>

      <div className="app-container">
      {searchInput !== "" && filteredAnimals.length > 0 ? (
    <div className="info-container">
      <div id="total-dogs">Total Dogs: {data.totalDogs} </div>
      <div id="top-breeds">Top Breeds: {data.topBreeds.map(([breed, count]) => `${breed}: ${count}`).join(', ')}</div>
      <div id="age-groups">Age Groups: {Object.entries(data.ageCounts).map(([ageGroup, count]) => `${ageGroup}: ${count}`).join(', ')}</div>
    </div>
  ) : <div className="info-container">
    <div id="total-dogs">Total Dogs:  {data.totalDogs} </div>
    <div id="top-breeds">Top Breeds: {data.topBreeds.map(([breed, count]) => `${breed}: ${count}`).join(', ')}</div>
    <div id="age-groups">Age Groups: {Object.entries(data.ageCounts).map(([ageGroup, count]) => `${ageGroup}: ${count}`).join(', ')}</div>
  </div>}
  <PetData data={searchInput !== "" ? filteredAnimals : data} />
      </div>
    </div>
  );

}

export default App;