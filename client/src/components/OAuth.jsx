import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleClick = async () => {
    if (loading) return; // prevent multiple clicks
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.error('Could not sign in with Google:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      disabled={loading}
      className='flex items-center justify-center gap-2 w-full bg-red-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-50 transition'
    >
      <FcGoogle size={20} />
      {loading ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
}
