// Stats.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

interface User {
    name: string;
    pokedexId: string;
    sprite: string;
    stats: {
        HP: number,
        attack: number,
        defense: number,
        special_attack: number,
        special_defense: number,
        speed: number
    };
}
const Stats: React.FC = () => {
    // Utilisez le hook useParams pour récupérer les paramètres d'URL
    const { pokedexId } = useParams<{ pokedexId: string }>();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchStats = async () => {
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

    const usersToDisplay = users;

    useEffect(() => {
        fetchStats();
    }, []);
    return (
        <>
            {isLoading && (
                <div className="spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            )}
            <div>
                <h2>Stats Page</h2>
                <p>Stats for Pokémon with Pokedex ID: {pokedexId}</p>

                {/* Bouton de retour vers la page principale */}
                <Link to="/">
                    <button>Retour à la page principale</button>
                </Link>
            </div>
            <table id="tbl-users" className="table table-hover">
                <thead>
                    {usersToDisplay.map((user) => (
                        <tr key={user.pokedexId}>
                            <td><img src={user.sprite} alt="User Thumbnail" /></td>
                            <td>{user.stats.HP}</td>
                            <td>{user.stats.attack}</td>
                            <td>{user.stats.defense}</td>
                            <td>{user.stats.special_attack}</td>
                        </tr>
                    ))}
                </thead>
            </table>
        </>
    );
};

export default Stats;
