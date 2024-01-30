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
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(16); // Nombre de Pokémon par page

  const fetchPokemon = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://pokebuildapi.fr/api/v1/pokemon/limit/100');
      setUsers(response.data);
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

  // Index du dernier Pokémon de la page
  const indexOfLastUser = currentPage * usersPerPage;
  // Index du premier Pokémon de la page
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  // Utilisateurs de la page actuelle
  const currentUsers = searchUser(users).slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    fetchPokemon();
  }, []);

  // Changer de page
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
          {/* Page principale avec la navigation */}
          <Route path='/' element={
            <div className="container">
              <h1>Pokédex</h1>
              <div className='filtre'>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un pokémon" />
              </div>
              <div className="card-container">
                {currentUsers.map((user) => (
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
              {/* Pagination */}
              <div className="pagination">
                {Array.from({ length: Math.ceil(searchUser(users).length / usersPerPage) }, (_, index) => (
                  <button key={index + 1} onClick={() => paginate(index + 1)}>{index + 1}</button>
                ))}
              </div>
            </div>
          } />
  
          {/* Route pour la page de statistiques */}
          <Route path='/Stats/:pokedexId' element={<Stats />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
