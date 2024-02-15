// Stats.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './Stat.css';
import { AiOutlineHome } from "react-icons/ai";
import { FaAnglesDown } from "react-icons/fa6";
import GetOnePokemon from '../component/PokemonEvol';

interface TypePok {
  name: string;
  image: string;
}

interface Ressistance {
  name: string;
  damage_multiplier: number;
  damage_relation: string;
}

interface UserStats {
  HP: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

interface User {
  id: number;
  name: string;
  pokedexId: string;
  sprite: string;
  image: string;
  stats: UserStats;
  apiTypes: TypePok[];
  apiResistances: Ressistance[];
}

const Stats: React.FC = () => {
  const { pokedexId } = useParams<{ pokedexId: string }>();
  const { pokemon, pokemonEvolution, pokemonPreEvolution } = GetOnePokemon(Number(pokedexId));
  const [userData, setUserData] = useState<Partial<User> | null>({
    id: 0,
    name: '',
    pokedexId: "",
    sprite: '',
    image: '',
    stats: {
      HP: 0,
      attack: 0,
      defense: 0,
      special_attack: 0,
      special_defense: 0,
      speed: 0,
    },
    apiTypes: [],
    apiResistances: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchPokemonData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://pokebuildapi.fr/api/v1/pokemon/${pokedexId}`);
      setUserData(response.data);

      setUserData((prevState) => ({ ...prevState, }) as Partial<User>);
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonData();
  }, [pokedexId]);

  const getResistanceColorClass = (damageMultiplier: number): string => {
    if (damageMultiplier > 1.5) {
      return 'vulnerable-color';
    } else if (damageMultiplier <= 0.5) {
      return 'resistant-color';
    } else {
      return 'neutral-color';
    }
  };

  return (
    <>

      {userData && (
        <div className="stats-container">
          <div className="overlay">
            {isLoading && (
              <div className='ball-container'>
                <div className="ball">
                </div>
              </div>
            )}
          </div>
          <div className='header-stats'>
            <div className='header-stat'>
              <h1>{userData.name}</h1>
            </div>
            <div className='button-place'>
              <Link to="/">
                <button><AiOutlineHome /></button>
              </Link>
            </div>
          </div>

          <div className="pokemon-card">
            <div className='image'>
              <div className="pokemon-image">
                <img src={userData.image} alt="User Thumbnail" />
              </div>
              <div className="pokemon-types">
                <h4>Types:</h4>
                {userData.apiTypes ? (
                  <ul>
                    {userData.apiTypes.map((type, index) => (
                      <li key={index}>
                        <img className='type-image' src={type.image} alt={`${type.name} Type`} />
                        <div className="type-name-container">
                          <span>{type.name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun type disponible</p>
                )}
              </div>
            </div>

            <div className="pokemon-stats">

              <div className="progress-bar">
                <span>HP: {userData.stats?.HP}</span>
                <div className="progress">
                  <div className="progress-bar-inner" style={{ width: `${(userData.stats!.HP / 255) * 100}%` }} />
                </div>
              </div>

              <div className="progress-bar">
                <span>Attaque: {userData.stats?.attack}</span>
                <div className="progress">
                  <div className="progress-bar-inner" style={{ width: `${(userData.stats!.attack / 255) * 100}%` }} />
                </div>

              </div>
              <div className="progress-bar">
                <span>Défense: {userData.stats?.defense}</span>
                <div className="progress">
                  <div className="progress-bar-inner" style={{ width: `${(userData.stats!.defense / 255) * 100}%` }} />
                </div>
              </div>

              <div className="progress-bar">
                <span>Attaque spéciale: {userData.stats?.special_attack}</span>
                <div className="progress">
                  <div className="progress-bar-inner" style={{ width: `${(userData.stats!.special_attack / 255) * 100}%` }} />
                </div>
              </div>

              <div className="progress-bar">
                <span>Attaque défense: {userData.stats?.special_defense}</span>
                <div className="progress">
                  <div className="progress-bar-inner" style={{ width: `${(userData.stats!.special_attack / 255) * 100}%` }} />
                </div>
              </div>

              <div className="progress-bar">
                <span>Vitesse:{userData.stats?.speed}</span>
                <div className="progress">
                  <div className="progress-bar-inner" style={{ width: `${(userData.stats!.speed / 255) * 100}%` }} />
                </div>

              </div>
              <div className='resistances'>
                {userData.apiResistances && userData.apiResistances.length > 0 && (
                  <div className="resistances-container">
                    <div className="resistance-category">
                      <h4>Vulnérable</h4>
                      <ul>
                        {userData.apiResistances
                          .filter((resistance) => resistance.damage_multiplier > 1)
                          .map((resistance, index) => (
                            <li key={index}>
                              <span className={getResistanceColorClass(resistance.damage_multiplier)}>
                                {resistance.name}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className="resistance-category">
                      <h4>Résistant</h4>
                      <ul>
                        {userData.apiResistances
                          .filter((resistance) => resistance.damage_multiplier < 1)
                          .map((resistance, index) => (
                            <li key={index}>
                              <span className={getResistanceColorClass(resistance.damage_multiplier)}>
                                {resistance.name}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className="resistance-category">
                      <h4>Neutre</h4>
                      <ul>
                        {userData.apiResistances
                          .filter((resistance) => resistance.damage_multiplier === 1)
                          .map((resistance, index) => (
                            <li key={index}>
                              <span className={getResistanceColorClass(resistance.damage_multiplier)}>
                                {resistance.name}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="image-evolutions-container">
              {pokemonPreEvolution && pokemon && pokemonPreEvolution.id === pokemon.id ? (
                <p className='evo-pokemon'></p>
              ) : (
                pokemonPreEvolution ? (
                  <Link to={`/Stats/${pokemonPreEvolution.id}`}>
                    <img className='evo-pokemon' src={pokemonPreEvolution.image}
                      alt={pokemonPreEvolution.name} />
                  </Link>
                ) : (
                  <p></p>
                )
              )}
              <div className='down-arrow'>
                <FaAnglesDown />
              </div>
              <img className='evo-pokemon' src={userData.image} alt={userData.name} />
              <div className='down-arrow'>
                <FaAnglesDown />
              </div>
              {pokemonEvolution && pokemon && pokemonEvolution.id === pokemon.id ? (
                <p className='evo-pokemon'>Pas d'évolution</p>
              ) : (
                pokemonEvolution ? (
                  <Link to={`/Stats/${pokemonEvolution.id}`}>
                    <img className='evo-pokemon' src={pokemonEvolution.image}
                      alt={pokemonEvolution.name} />
                  </Link>
                ) : (
                  <p></p>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stats;
