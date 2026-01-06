import React, { useEffect, useState } from 'react';
import { Search, Home, Info } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 text-lg font-bold">
          <span className="text-slate-500">World</span>
          <span className="text-slate-800">Estate</span>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-slate-100 rounded-full px-4 py-2 shadow-inner focus-within:ring-2 focus-within:ring-green-500 transition"
        >
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none w-28 sm:w-64 text-sm"
          />
          <button type="submit">
            <Search size={18} className="text-slate-500 hover:text-slate-700" />
          </button>
        </form>

        {/* Navigation */}
        <nav className="flex items-center gap-5">
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1 text-slate-700 hover:text-green-600 transition"
          >
            <Home size={18} />
            Home
          </Link>

          <Link
            to="/about"
            className="hidden sm:flex items-center gap-1 text-slate-700 hover:text-green-600 transition"
          >
            <Info size={18} />
            About
          </Link>

          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar || '/user-profile.png'}
                alt="profile"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-transparent hover:ring-green-500 transition"
              />
            ) : (
              <span className="text-slate-700 hover:text-green-600 font-medium transition">
                Sign in
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
