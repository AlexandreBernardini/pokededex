import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Stats from './Stats';
import Modal from '../component/Modal';
import useModal from '../component/useModal';
import PokemonCard from '../component/PokemonCard';
import { RiTeamFill } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import PokeTeam from './Team';

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
  const { isOpen, toggle } = useModal();
  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState('Tous les types');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedGeneration, setSelectedGeneration] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1); // État pour gérer la page actuelle
  const itemsPerPage = 32; // Nombre de Pokémon par page

  const [formData, setFormData] = useState({
    name: '',
    prenom: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Enregistrer les données dans le stockage local
    localStorage.setItem('idconnection', JSON.stringify(formData));
    // Réinitialiser le formulaire après l'envoi
    setFormData({
      name: '',
      prenom: '',
      password: ''
    });
  };

  async function fetchPokemon() {
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
  }

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

  // Calcule l'index de début et de fin des Pokémon à afficher sur la page actuelle
  const indexOfLastPokemon = currentPage * itemsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - itemsPerPage;
  const filteredUsers = sortUsers(filterByType(filterByGeneration(searchUser(users))));
  const currentPokemon = filteredUsers.slice(indexOfFirstPokemon, indexOfLastPokemon);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <div className="container">

              {isLoading && (
                <div className="overlay">
                  <div className='ball-container'>
                    <div className="ball">
                    </div>
                  </div>
                </div>
              )}

              <div className='header'>
                <h1>Pokédex</h1>
                <div className="modal-conatiner">
                  <Link to="/Team">
                    <button className='button-container'><RiTeamFill /></button>
                  </Link>
                  <button className='button-container' onClick={toggle}><MdAccountCircle /> </button>
                  <Modal isOpen={!isOpen} toggle={toggle}>
                    <form onSubmit={handleSubmit}>
                      <label>
                        <ul>
                          <li>
                            Nom :
                            <input type="text" name='name' value={formData.name} onChange={handleChange} />
                          </li>
                          <li>
                            prénom :
                            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} />
                          </li>
                          <li>
                            mot de passe :
                            <input type="password" name='password' value={formData.password} onChange={handleChange} />
                          </li>
                        </ul>
                      </label>

                      <input type="submit" value="Envoyer" />
                    </form>
                    <button onClick={toggle}>Quitter</button>
                  </Modal>
                </div>
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
                {currentPokemon.map((user) => (
                  <PokemonCard key={user.id} pokemon={user} />
                ))}
              </div>

              {/*Pagination */}
              <div className="pagination">
                {currentPage > 1 && (
                  <button onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button>
                )}
                {/* Afficher les 3 pages suivantes */}
                {Array.from({ length: Math.min(3, Math.ceil(filteredUsers.length / itemsPerPage) - currentPage) }, (_, i) => (
                  <button key={currentPage + i + 1} onClick={() => setCurrentPage(currentPage + i + 1)}>
                    {currentPage + i + 1}
                  </button>
                ))}
                {/* Afficher le bouton "Suivant" */}
                {currentPage < Math.ceil(filteredUsers.length / itemsPerPage) && (
                  <button onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button>
                )}
              </div>
            </div>
          } />
          <Route path='/Stats/:pokedexId' element={<Stats />} />
          <Route path='/Team' element={<PokeTeam />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
