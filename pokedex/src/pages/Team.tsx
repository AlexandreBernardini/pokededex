import React, { useState, useEffect } from "react";
import axios from "axios";
import PokemonCard from "../component/PokemonCard";
import { Link } from 'react-router-dom';
import { AiOutlineHome } from "react-icons/ai";
import './Team.css';

interface Pokemon {
    id: number;
    name: string;
    image: string;
    apiTypes: {
        name: string;
        image: string;
    }[];
}

const PokeTeam: React.FC = () => {
    const [capturedPokemonArray, setCapturedPokemonArray] = useState<number[]>([]);
    const [pokemonDetails, setPokemonDetails] = useState<Pokemon[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCapturedPokemons = () => {
            const capturedPokemons = localStorage.getItem('capturedPokemons');
            if (capturedPokemons) {
                setCapturedPokemonArray(JSON.parse(capturedPokemons));
            }
        };

        fetchCapturedPokemons();
    }, []);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            const details = await Promise.all(
                capturedPokemonArray.map(async (pokemonId) => {
                    try {
                        setIsLoading(true);
                        const response = await axios.get(`https://pokebuildapi.fr/api/v1/pokemon/${pokemonId}`);
                        return response.data;
                    } catch (error) {
                        console.log(error);
                        return null;
                    }
                    finally {
                        setIsLoading(false);
                    }
                })
            );
            setPokemonDetails(details.filter(Boolean));
        };

        fetchPokemonDetails();
    }, [capturedPokemonArray]);

    return (
        <div>
            <div className='button-Team'>
              <Link to="/">
                <button><AiOutlineHome /></button>
              </Link>
            </div>
            {isLoading && (
                <div className="overlay">
                    <div className='ball-container'>
                        <div className="ball">
                        </div>
                    </div>
                </div>
            )}
            <h1>Equipe Pokemon</h1>
            <div className="card-container">
                {pokemonDetails.map((pokemon) => (
                    <div key={pokemon.id}>
                        <PokemonCard pokemon={pokemon} />
                        <button onClick={() => {}}>Supprimer</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PokeTeam;