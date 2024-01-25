// App.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Stats from './Stats';

interface User {
  name: string;
  pokedexId: string;
  sprite: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState<string>('');

  const fetchPokemon = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://pokebuildapi.fr/api/v1/pokemon/limit/100');
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchUser = (userList: User[]) => {
    if (search) {
      return userList.filter(user => (
        user.name.toLowerCase().includes(search.toLowerCase())
      ));
    }
    return userList;
  };

  const usersToDisplay = searchUser((users));

  useEffect(() => {
    fetchPokemon();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="spinner-container">
          <div className="loading-spinner"></div>
        </div>
      )}
      <BrowserRouter>
        <Routes>
          {/* Page principale avec la navigation */}
          <Route path='/' element={
            <>
              <h1>Pokédex</h1>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un pokémon" />
              <table id="tbl-users" className="table table-hover">
                <thead>
                  {usersToDisplay.map((user) => (
                    <tr key={user.pokedexId}>
                      <td><img src={user.sprite} alt="User Thumbnail" /></td>
                      <td>{user.pokedexId}</td>
                      <td>
                        {user.name}
                        <Link to={`/Stats/${user.pokedexId}`}>
                          <label>   Stats</label>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </thead>
              </table>
            </>
          } />
  
          {/* Route pour la page de statistiques */}
          <Route path='/Stats/:pokedexId' element={<Stats />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
