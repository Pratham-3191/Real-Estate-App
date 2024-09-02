import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Link } from "react-router-dom"
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
} from '../../Redux/user/userSlice'
import { errorHandler } from '../../../api/utils/error'

export default function Profile() {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({})
  const [userListings, setUserListings] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [showListingError, setShowListingError] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(userUpdateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
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
      const res = await fetch(`/api/auth/signout`)
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
  const handleShowListings = async () => {
    try {
      setShowListingError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true)
        return;
      }
      setUserListings(data)
    } catch (error) {
      setShowListingError(true)
    }
  }
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (data.success === false) {
        errorHandler(401, data.message)
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId))

    } catch (error) {
      errorHandler(401, error.message)
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <img src={currentUser.avatar} alt="profile"
          className='rounded-full h-24 w-24 cursor-pointer object-cover self-center mt-2' />
        <input type='text' placeholder="userName" id='userName' onChange={handleChange}
          className='border p-3 rounded-lg' defaultValue={currentUser.userName} />
        <input type='text' placeholder='email' id='email' onChange={handleChange}
          className='border p-3 rounded-lg' defaultValue={currentUser.email} />
        <input type='password' placeholder='password' id='password' onChange={handleChange}
          className='border p-3 rounded-lg' />
        <button disabled={loading} className='bg-slate-700
           text-white uppercase text-whiye rounded-lg p-3 hover:opacity-90'>
          {loading ? "Loading" : "Update"}</button>
        <Link to={"/create-listing"} className="bg-green-700 text-white p-3 rounded-lg 
            uppercase text-center hover:opacity-95">create listing
        </Link>
      </form>
      <form>
        <div className='flex justify-between mt-5'>
          <span onClick={handleDeleteUser}
            className='text-red-700 cursor-pointer'>Delete Account</span>
          <span onClick={handleSignOut}
            className='text-red-700 cursor-pointer'>Sign Out</span>
        </div>
      </form>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingError ? 'Error Showing listings' : ''}</p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}