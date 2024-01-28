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
  apiTypes: TypePok[];
  apiResistances: Ressistance[];
  evolutionDetails: { name: string; pokedexId: number; sprite: string }[];
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
    apiTypes: [],
    apiResistances: [],
    evolutionDetails: [],
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

      const evolutionDetails = await Promise.all(evolutionDetailsPromises);

      setUserData((prevState) => ({
        ...prevState,
        evolutionDetails: [...evolutionDetails],
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

  const getResistanceType = (damageMultiplier: number): string => {
    if (damageMultiplier > 1.5) {
      return 'Vulnérable';
    } else if (damageMultiplier < 0.5) {
      return 'Résistant';
    } else {
      return 'Neutre';
    }
  };

  const getResistanceColorClass = (damageMultiplier: number): string => {
    if (damageMultiplier > 1.5) {
      return 'vulnerable-color';
    } else if (damageMultiplier < 0.5) {
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
                        {type.name}
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
    <span>HP:</span>
    <div className="progress">
      <div
        className="progress-bar-inner"
        style={{ width: `${(userData.stats?.HP / 255) * 100}%` }}
      ></div>
    </div>
  </div>
  <div className="progress-bar">
    <span>Attaque:</span>
    <div className="progress">
      <div
        className="progress-bar-inner"
        style={{ width: `${(userData.stats?.attack / 255) * 100}%` }}
      ></div>
    </div>
  </div>
  <div className="progress-bar">
    <span>Défense:</span>
    <div className="progress">
      <div
        className="progress-bar-inner"
        style={{ width: `${(userData.stats?.defense / 255) * 100}%` }}
      ></div>
    </div>
  </div>
  <div className="progress-bar">
    <span>Attaque spéciale:</span>
    <div className="progress">
      <div
        className="progress-bar-inner"
        style={{ width: `${(userData.stats?.special_attack / 255) * 100}%` }}
      ></div>
    </div>
  </div>
  <div className="progress-bar">
    <span>Vitesse:</span>
    <div className="progress">
      <div
        className="progress-bar-inner"
        style={{ width: `${(userData.stats?.speed / 255) * 100}%` }}
      ></div>
    </div>
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
      )}
    </>
  );
};

export default Stats;
