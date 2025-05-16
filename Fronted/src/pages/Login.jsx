import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      // Save token & user info in localStorage (or context/state if you want)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert('Login successful!');

      // Navigate depending on role, example for farmer
      if(user.role === 'farmer') {
        navigate('/FarmerDashboard');
      } else {
        navigate('/CustomerDashboard'); // or other route for customers
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left image section */}
      <div className="w-1/2 bg-gradient-to-br from-green-200 to-green-500 flex items-center justify-center">
        <img
          src="https://img.freepik.com/free-vector/organic-farming-concept_23-2148433516.jpg?semt=ais_hybrid&w=740"
          alt="Farmer"
          className="w-3/4 h-auto"
        />
      </div>

      {/* Right form section */}
      <div className="w-1/2 flex flex-col justify-center px-20">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Welcome Back!</h2>
        <p className="mb-6 text-gray-600">Login to your account</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;