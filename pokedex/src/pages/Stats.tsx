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
    if (damageMultiplier > 1) {
      return 'Sensible';
    } else if (damageMultiplier < 1) {
      return 'Résistant';
    } else {
      return 'Neutre';
    }
  };

  const getResistanceColorClass = (damageMultiplier: number): string => {
    if (damageMultiplier > 1) {
      return 'sensible-color';
    } else if (damageMultiplier < 1) {
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
              <h3>Stats</h3>
              <table>
                <tbody>
                  <tr>
                    <td>HP:</td>
                    <td>{userData.stats?.HP}</td>
                  </tr>
                  <tr>
                    <td>Attaque:</td>
                    <td>{userData.stats?.attack}</td>
                  </tr>
                  <tr>
                    <td>Défense:</td>
                    <td>{userData.stats?.defense}</td>
                  </tr>
                  <tr>
                    <td>Attaque spéciale:</td>
                    <td>{userData.stats?.special_attack}</td>
                  </tr>
                  <tr>
                    <td>Vitesse:</td>
                    <td>{userData.stats?.speed}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Affichage des résistances du Pokémon */}
            <div className="pokemon-resistances">
              <h3>Résistances</h3>
              {userData.apiResistances && userData.apiResistances.length > 0 ? (
                <ul>
                  {userData.apiResistances.map((resistance, index) => (
                    <li
                      key={index}
                      className={`${getResistanceColorClass(
                        resistance.damage_multiplier
                      )} resistance-item`}
                    >
                      <span className="resistance-name">{resistance.name}</span> -{' '}
                      {getResistanceType(resistance.damage_multiplier)} (
                      {resistance.damage_relation})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aucune résistance disponible</p>
              )}
            </div>
          </div>

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
      )}
    </>
  );
};

export default Stats;
