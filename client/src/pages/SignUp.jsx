import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({ userName: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate('/sign-in');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Something went wrong');
    }
  };

  // Check if all fields are filled
  const isFormComplete = formData.userName && formData.email && formData.password;

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-100 p-4'>
      <div className='bg-white shadow-lg rounded-xl p-8 max-w-md w-full'>
        <h1 className='text-3xl font-bold text-center text-slate-700 mb-6'>Sign Up</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            placeholder='Username'
            type='text'
            className='border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-400'
            id='userName'
            onChange={handleChange}
            value={formData.userName}
            required
          />
          <input
            placeholder='Email'
            type='email'
            className='border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-400'
            id='email'
            onChange={handleChange}
            value={formData.email}
            required
          />
          <input
            placeholder='Password'
            type='password'
            className='border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-400'
            id='password'
            onChange={handleChange}
            value={formData.password}
            required
          />

          <button
            disabled={loading || !isFormComplete}
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-50 transition'
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>

          <div className='my-2'>
            <OAuth />
          </div>

          <p className='text-center text-sm text-slate-600'>
            Have an account?{' '}
            <Link to='/sign-in' className='text-blue-700 font-semibold hover:underline'>
              Sign In
            </Link>
          </p>

          {error && <p className='text-red-500 text-center mt-3'>{error}</p>}
        </form>
      </div>
    </div>
  );
}
