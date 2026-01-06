import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice.js';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      dispatch(signInFailure(null));
    }
  }, [dispatch, error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormComplete) return;

    try {
      dispatch(signInStart());
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  const isFormComplete = formData.email && formData.password;

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-100 p-4'>
      <div className='bg-white shadow-lg rounded-xl p-8 max-w-md w-full'>
        <h1 className='text-3xl font-bold text-center text-slate-700 mb-6'>Sign In</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            placeholder='Email'
            type='email'
            className='border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-400 transition'
            id='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            placeholder='Password'
            type='password'
            className='border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-400 transition'
            id='password'
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type='submit'
            disabled={loading || !isFormComplete}
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-50 transition'
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>

          <div className='my-2'>
            <OAuth />
          </div>

          <p className='text-center text-sm text-slate-600'>
            Don't have an account?{' '}
            <Link to='/sign-up' className='text-blue-700 font-semibold hover:underline'>
              Sign Up
            </Link>
          </p>

          {error && <p className='text-red-500 text-center mt-3'>{error}</p>}
        </form>
      </div>
    </div>
  );
}
