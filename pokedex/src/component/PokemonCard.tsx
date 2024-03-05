import React from 'react';
import { Link } from 'react-router-dom';
import './PokemonCard.css';

interface PokemonCardProps {
    pokemon: {
        id: number;
        name: string;
        image: string;
        apiTypes: {
            name: string;
            image: string;
        }[];
    };
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
    return (
         <Link to={`/Stats/${pokemon.id}`}>
                    <div className="card" key={pokemon.id}>
                      <img src={pokemon.image} alt="pokemon Thumbnail" />
                      <div className="card-details">
                        <span>N°{pokemon.id}</span>
                        <span>{pokemon.name}</span>
                      </div>
                      <div className="pokemon-types-app">
                        {pokemon.apiTypes ? (
                          <ul>
                            {pokemon.apiTypes.map((type, index) => (
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
    );
};

export default PokemonCard;