import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom"
import { Trash2, Edit3, Home, AlertCircle } from 'lucide-react';
import {
  userUpdateStart,
  userUpdateSuccess,
  userUpdateFailure,
  userDeleteStart,
  userDeleteSuccess,
  userDeleteFailure,
  userSignoutStart,
  userSignoutSuccess,
  userSignoutFailure
} from '../../redux/user/userSlice.js';
import { errorHandler } from '../../../api/utils/error'

export default function Profile() {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({})
  const [userListings, setUserListings] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListings, setShowListings] = useState(false); // toggle show/hide
  const [showListingError, setShowListingError] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (error) {
      dispatch(userUpdateFailure(null));
    }
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(userUpdateStart());
      const res = await fetch(`${BASE_URL}/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(userUpdateFailure(data.message));
        return;
      }
      dispatch(userUpdateSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(userUpdateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(userDeleteStart());
      const res = await fetch(`${BASE_URL}/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(userDeleteFailure(data.message));
        return;
      }
      dispatch(userDeleteSuccess(data));
    } catch (error) {
      dispatch(userDeleteFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(userSignoutStart())
      const res = await fetch(`${BASE_URL}/api/auth/signout`)
      const data = await res.json();
      if (data.success === false) {
        dispatch(userSignoutFailure(data.message))
        return;
      }
      dispatch(userSignoutSuccess(data))
    } catch (error) {
      dispatch(userSignoutFailure(error.message))
    }
  }

  const handleToggleListings = async () => {
    if (!showListings) { // show listings
      try {
        setShowListingError(false)
        const res = await fetch(`${BASE_URL}/api/user/listings/${currentUser._id}`, {
          credentials: 'include',
        })
        const data = await res.json();
        if (data.success === false) {
          setShowListingError(true)
          return;
        }
        setUserListings(data)
        setShowListings(true)
      } catch (error) {
        setShowListingError(true)
      }
    } else { // hide listings
      setShowListings(false)
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json();
      if (data.success === false) {
        errorHandler(401, data.message)
        return;
      }
      setUserListings(prev => prev.filter(listing => listing._id !== listingId))
    } catch (error) {
      errorHandler(401, error.message)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <img src={currentUser.avatar || '/user-profile.png'} alt="profile"
          className='rounded-full h-24 w-24 cursor-pointer object-cover self-center mt-2' />
        <input type='text' placeholder="userName" id='userName' onChange={handleChange}
          className='border p-3 rounded-lg' defaultValue={currentUser.userName} />
        <input type='text' placeholder='email' id='email' onChange={handleChange}
          className='border p-3 rounded-lg' defaultValue={currentUser.email} />
        <input type='password' placeholder='password' id='password' onChange={handleChange}
          className='border p-3 rounded-lg' />
        <button disabled={loading} className='bg-slate-700 text-white uppercase rounded-lg p-3 hover:opacity-90'>
          {loading ? "Loading" : "Update"}
        </button>
        <Link to={"/create-listing"} className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95">
          Create Listing
        </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully!' : ''}</p>

      <button onClick={handleToggleListings} className='text-green-700 w-full mb-4'>
        {showListings ? 'Hide Listings' : 'Show Listings'}
      </button>

      {showListings && (
  <div className="mt-6">
    {/* Error */}
    {showListingError && (
      <div className="flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-lg">
        <AlertCircle size={18} />
        <p>Error showing listings</p>
      </div>
    )}

    {userListings.length > 0 ? (
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl font-semibold flex items-center justify-center gap-2">
          <Home className="text-green-600" />
          Your Listings
        </h1>

        {userListings.map((listing) => (
          <div
            key={listing._id}
            className="flex items-center gap-4 p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-white"
          >
            {/* Image */}
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing cover"
                className="h-20 w-20 rounded-lg object-cover"
              />
            </Link>

            {/* Title */}
            <Link
              to={`/listing/${listing._id}`}
              className="flex-1 font-semibold text-slate-700 hover:underline truncate"
            >
              {listing.name}
            </Link>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleListingDelete(listing._id)}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
              >
                <Trash2 size={18} />
                <span className="hidden sm:inline">Delete</span>
              </button>

              <Link
                to={`/update-listing/${listing._id}`}
                className="flex items-center gap-1 text-green-600 hover:text-green-800 transition"
              >
                <Edit3 size={18} />
                <span className="hidden sm:inline">Edit</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="mt-6 text-center text-gray-500 bg-gray-50 p-6 rounded-lg">
        <Home size={32} className="mx-auto mb-2 text-gray-400" />
        <p className="font-medium">No listings found</p>
        <p className="text-sm">Create a listing to see it here</p>
      </div>
    )}
  </div>
)}

    </div>
  );
}
