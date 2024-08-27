import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { userUpdateStart, userUpdateSuccess, userUpdateFailure } from '../../Redux/user/userSlice'

function Profile() {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user)
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
  return (
    <>
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
          <button disabled={loading} className='bg-slate-700 text-white uppercase text-whiye rounded-lg p-3 hover:opacity-90'>
            {loading?"Loading":"Update"}</button>
        </form>
        <form>
          <div className='flex justify-between mt-5'>
            <span className='text-red-700 cursor-pointer'>Delete Account</span>
            <span className='text-red-700 cursor-pointer'>Sign Out</span>
          </div>
        </form>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      </div>
    </>
  )
}

export default Profile