import { useEffect, useState } from 'react';
import axios from 'axios';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  apiTypes: { 
    name: string;
    image: string;
  }[];
  apiPreEvolution: {
    name: string;
    pokedexId: number;
  };
  apiEvolutions: {
    name: string;
    pokedexIdd: number;
  }[];
  stats: {
    HP: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  };
}

const getOnePokemon = (pokemonId: number) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [pokemonEvolution, setPokemonEvolution] = useState<Pokemon | null>(null);
  const [pokemonPreEvolution, setPokemonPreEvolution] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(`https://pokebuildapi.fr/api/v1/pokemon/${pokemonId}`);
        setPokemon(response.data);
        console.log(response.data);

        const evolutionId = response.data.apiEvolutions[0]?.pokedexId;
        const preEvolutionId = response.data.apiPreEvolution?.pokedexIdd;
        

        if (evolutionId) {
          await fetchPokemonEvolution(evolutionId);
        } 

        if (preEvolutionId && preEvolutionId !== 'none') {
            await fetchPokemonPreEvolution(preEvolutionId);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    const fetchPokemonEvolution = async (evolutionId: number) => {
      try {
        const evolutionResponse = await axios.get(`https://pokebuildapi.fr/api/v1/pokemon/${evolutionId}`);
        setPokemonEvolution(evolutionResponse.data);
        
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPokemonPreEvolution = async (prevEvolutionId: number) => {
      try {
        const pokemonPreEvolution = await axios.get(`https://pokebuildapi.fr/api/v1/pokemon/${prevEvolutionId}`);
        setPokemonPreEvolution(pokemonPreEvolution.data);
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchPokemonDetails();
  }, [pokemonId]);

  return { pokemon, pokemonEvolution, pokemonPreEvolution, loading };
};

export default getOnePokemon;