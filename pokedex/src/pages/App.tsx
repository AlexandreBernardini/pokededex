import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Stats from './Stats';

interface TypePok {
  name: string;
  image: string;
}

interface User {
  id: number;
  name: string;
  pokedexId: string;
  sprite: string;
  apiTypes: TypePok[];
  apiGeneration: number;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [types, setTypes] = useState<TypePok[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(16);
  const [selectedType, setSelectedType] = useState('Tous les types');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedGeneration, setSelectedGeneration] = useState<string>('all');

  const fetchPokemon = async () => {
    setIsLoading(true);
    try {
      let apiUrl = 'https://pokebuildapi.fr/api/v1/pokemon/';

      if (selectedGeneration !== 'all') {
        apiUrl += `generation/${selectedGeneration}`;
      }

      const [pokemonResponse, typesResponse] = await Promise.all([
        axios.get(apiUrl),
        axios.get('https://pokebuildapi.fr/api/v1/types'),
      ]);

      setTypes(typesResponse.data);
      setUsers(pokemonResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortUsers = (userList: User[]): User[] => {
    return [...userList].sort((a, b) => {
      const propA = a.id;
      const propB = b.id;

      if (sortOrder === 'asc') {
        return propA - propB;
      } else {
        return propB - propA;
      }
    });
  };

  const filterByType = (userList: User[]) => {
    return selectedType === 'Tous les types' ? userList : userList.filter(user => user.apiTypes.some(type => type.name === selectedType));
  };

  const filterByGeneration = (userList: User[]) => {
    return selectedGeneration === 'all' ? userList : userList.filter(user => user.apiGeneration === parseInt(selectedGeneration));
  };

  const searchUser = (userList: User[]) => {
    if (search) {
      return userList.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));
    }
    return userList;
  };

  useEffect(() => {
    fetchPokemon();
  }, [selectedGeneration, selectedType, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGeneration, selectedType, sortOrder]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const filteredUsers = sortUsers(filterByType(filterByGeneration(searchUser(users))));
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      {isLoading && (
        <div className="spinner-container">
          <div className="loading-spinner"></div>
        </div>
      )}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <div className="container">
              <h1>Pokédex</h1>
              <div className='filtre'>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un pokémon" />
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  <option value="Tous les types">Tous les types</option>
                  {types.map((type) => (
                    <option key={type.name} value={type.name}>
                      <img src={type.image} alt={type.name} />
                      {type.name}
                    </option>
                  ))}
                </select>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
                  <option value="asc">Tri Croissant</option>
                  <option value="desc">Tri Décroissant</option>
                </select>
                <select value={selectedGeneration} onChange={(e) => setSelectedGeneration(e.target.value)}>
                  <option value="all">Toutes les générations</option>
                  <option value="1">Génération 1</option>
                  <option value="2">Génération 2</option>
                  <option value="3">Génération 3</option>
                </select>
              </div>
              <div className="card-container">
  {filteredUsers.slice(indexOfFirstUser, indexOfLastUser).map((user) => (
    <div className="card" key={user.pokedexId}>
      <img src={user.sprite} alt="User Thumbnail" />
      <div className="card-details">
        <span>{user.pokedexId}</span>
        <span>{user.name}</span>
        <Link to={`/Stats/${user.pokedexId}`}>
          <label>Stats</label>
        </Link>
      </div>
    </div>
  ))}
</div>
              <div className="pagination">
              {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
  <button key={index + 1} onClick={() => paginate(index + 1)}>{index + 1}</button>
))}
              </div>
            </div>
          } />
          <Route path='/Stats/:pokedexId' element={<Stats />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
