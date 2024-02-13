import { useState, useEffect } from 'react';
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
  image: string;
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


  const filteredUsers = sortUsers(filterByType(filterByGeneration(searchUser(users))));


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <div className="container">
              {isLoading && (
                <div className='ball-container'>
                  <div className="ball">
                  </div>
                </div>
              )}
              <div className='header'>
                <h1>Pokédex</h1>
              </div>
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
                  <option value="4">Génération 4</option>
                  <option value="5">Génération 5</option>
                  <option value="6">Génération 6</option>
                  <option value="7">Génération 7</option>
                  <option value="8">Génération 8</option>
                </select>
              </div>
              <div className="card-container">
                {filteredUsers.slice().map((user) => (
                  <Link to={`/Stats/${user.pokedexId}`}>
                    <div className="card" key={user.pokedexId}>
                      <img src={user.image} alt="User Thumbnail" />
                      <div className="card-details">
                        <span>N°{user.pokedexId}</span>
                        <span>{user.name}</span>
                      </div>
                      <div className="pokemon-types-app">
                        {user.apiTypes ? (
                          <ul>
                            {user.apiTypes.map((type, index) => (
                              <li key={index}>
                                <img src={type.image} alt={`${type.name} Type`} />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>Aucun type disponible</p>
                        )}
                      </div>
                    </div>
                  </Link>
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