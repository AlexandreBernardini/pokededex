// import { useState } from 'react';

// function LoginForm({ onLogin }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = (e) => {
//     e.preventDefault();
//     const storedUsername = localStorage.getItem('username');
//     const storedPassword = localStorage.getItem('password');

//     if (username === storedUsername && password === storedPassword) {
//       onLogin(storedUsername);
//       setUsername('');
//       setPassword('');
//       setError('');
//     } else {
//       setError('Identifiant ou mot de passe incorrect');
//     }
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <label>
//         Username:
//         <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//       </label>
//       <label>
//         Password:
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       </label>
//       {error && <div style={{ color: 'red' }}>{error}</div>}
//       <button type="submit">Se connecter</button>
//     </form>
//   );
// }