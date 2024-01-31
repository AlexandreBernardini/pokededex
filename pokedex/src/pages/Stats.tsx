// Stats.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './Stat.css';

interface Evolution {
  name: string;
  pokedexId: number;
  sprite: string;
}

interface PreEvolution {
  name: string;
  pokedexId: number;
  sprite: string;
}

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
  name: string;
  pokedexId: string;
  sprite: string;
  image: string;
  stats: UserStats;
  apiEvolutions: Evolution[];
  apiPreEvolution: PreEvolution[];
  apiTypes: TypePok[];
  apiResistances: Ressistance[];
  evolutionDetails: { name: string; pokedexId: number; sprite: string }[];
  preEvolutionDetails: { name: string; pokedexId: number; sprite: string }[];
}

const Stats: React.FC = () => {
  const { pokedexId } = useParams<{ pokedexId: string }>();
  const [userData, setUserData] = useState<Partial<User> | null>({
    name: '',
    pokedexId: '',
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
    apiEvolutions: [],
    apiPreEvolution: [],
    apiTypes: [],
    apiResistances: [],
    evolutionDetails: [],
    preEvolutionDetails: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchPokemonData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://pokebuildapi.fr/api/v1/pokemon/${pokedexId}`);
      setUserData(response.data);

      const evolutionDetailsPromises = response.data.apiEvolutions.map(async (evolution: Evolution) => {
        const evolutionResponse = await axios.get(`https://pokebuildapi.fr/api/v1/pokemon/${evolution.pokedexId}`);
        return {
          name: evolutionResponse.data.name,
          pokedexId: evolutionResponse.data.pokedexId,
          sprite: evolutionResponse.data.sprite,
        };
      });
      const evolutionDetailsPromise = response.data.apiEvolutions.map(async (evolution: PreEvolution) => {
        const evolutionResponse = await axios.get(`https://pokebuildapi.fr/api/v1/pokemon/${evolution.pokedexId - 2}`);
        return {
          name: evolutionResponse.data.name,
          pokedexId: evolutionResponse.data.pokedexId,
          sprite: evolutionResponse.data.sprite,
        };
      });

      const evolutionDetails = await Promise.all(evolutionDetailsPromises);
      const preEvolutionDetails = await Promise.all(evolutionDetailsPromise);

      setUserData((prevState) => ({
        ...prevState,
        evolutionDetails: [...evolutionDetails],
        preEvolutionDetails: [...preEvolutionDetails],

      }) as Partial<User>);
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
      {isLoading && (
        <div className="spinner-container">
          <div className="loading-spinner"></div>
        </div>
      )}
      {userData && (
        <div className="stats-container">
          <h2>Page des Statistiques</h2>
          <p>Statistiques du Pokémon avec l'ID Pokedex : {userData.pokedexId}</p>

          <Link to="/">
            <button>Retour au Pokédex</button>
          </Link>

          <div className="pokemon-card">
            <div className="pokemon-image">
              <img src={userData.image} alt="User Thumbnail" />
              <div className="pokemon-types">
                <h4>Types:</h4>
                {userData.apiTypes ? (
                  <ul>
                    {userData.apiTypes.map((type, index) => (
                      <li key={index}>
                        <img src={type.image} alt={`${type.name} Type`} />
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
              <h3>{userData.name}</h3>

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
              {userData.apiResistances && userData.apiResistances.length > 0 && (
                <div>
                  <h3>Résistances</h3>
                  <div className="resistances-container">
                    <div className="resistance-category">
                      <h4>Vulnérable</h4>
                      <ul>
                        {userData.apiResistances
                          .filter((resistance) => resistance.damage_relation === 'vulnerable')
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
                          .filter((resistance) => resistance.damage_relation === 'resistant')
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
                          .filter((resistance) => resistance.damage_relation === 'neutral')
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
                </div>
              )}
            </div>

            <div className="evolution-container">
            {userData.preEvolutionDetails && userData.preEvolutionDetails.length > 0 && (
                <div>
                  <h3>prÉvolutions</h3>
                  <ul>
                    {userData.preEvolutionDetails.map((evolution) => (
                      <li key={evolution.pokedexId}>
                        <img src={evolution.sprite} alt={`${evolution.name} Thumbnail`} />
                        <span>{evolution.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>              
            )}
              {userData.evolutionDetails && userData.evolutionDetails.length > 0 && (
                <div>
                  <h3>Évolutions</h3>
                  <ul>
                    {userData.evolutionDetails.map((evolution) => (
                      <li key={evolution.pokedexId}>
                        <img src={evolution.sprite} alt={`${evolution.name} Thumbnail`} />
                        <span>{evolution.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}              
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stats;
