import React, { useState } from "react";
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage";
import { app } from "../firebase"
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const [files, setFiles] = useState([])
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user)
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    address: '',
    furnished: false,
    type: 'rent',
  });
  const [imageUploadError, setImageUploadError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  console.log(formData)
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true)
      setImageUploadError(false)
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false)
        setUploading(false)
      }).catch((error) => {
        setImageUploadError("Image upload failed(2 mb max per image)")
        setUploading(false)
      })
    } else {
      setImageUploadError("cannot upload more than 7 images")
      setUploading(false)
    }
  }
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`upload is ${progress}% done`)
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      )
    })
  }
  const handleRemoveImage = (index) => {
    let newImageUrls = formData.imageUrls.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      imageUrls: newImageUrls,
    });
  }
  const handleChange = (e) => {
    if (e.target.id == "sale" || e.target.id == 'rent') {
      setFormData({
        ...formData,
        type: e.target.id
      })
    }
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      })
    }
    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError('Please upload at least one image')
      if (+formData.discountedPrice > +formData.regularPrice) return setError("your discounted price must be less than regular price")
      setLoading(true)
      setError(false)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      })
      const data = await res.json();
      setLoading(false)
      if (data.success == false) {
        setError(error.messsage)
      }
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message)
      setLoading(false);
    }

  }
  return (
   <main className='p-4 max-w-6xl mx-auto bg-white rounded-xl shadow-md my-7 pb-10'>
  <h1 className='text-3xl font-bold text-center text-slate-700 mb-8'>
    Create a Listing
  </h1>

  <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row gap-6'>
    
    {/* LEFT SECTION */}
    <div className='flex flex-col gap-5 flex-1'>
      
      {/* Basic Info */}
      <div className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Name'
          className='border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-400'
          id='name'
          maxLength='62'
          minLength='10'
          required
          onChange={handleChange}
          value={formData.name}
        />
        <textarea
          placeholder='Description'
          className='border border-gray-300 rounded-lg p-3 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-slate-400'
          id='description'
          required
          onChange={handleChange}
          value={formData.description}
        />
        <input
          type='text'
          placeholder='Address'
          className='border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-400'
          id='address'
          required
          onChange={handleChange}
          value={formData.address}
        />
      </div>

      {/* Type & Amenities */}
      <div className='flex flex-wrap gap-6'>
        {['sale', 'rent', 'parking', 'furnished', 'offer'].map(item => (
          <div key={item} className='flex items-center gap-2'>
            <input
              type='checkbox'
              id={item}
              className='w-5 h-5 accent-slate-700'
              onChange={handleChange}
              checked={
                item === 'sale' ? formData.type === 'sale' :
                item === 'rent' ? formData.type === 'rent' :
                formData[item]
              }
            />
            <span className='capitalize'>{item === 'sale' ? 'Sell' : item === 'rent' ? 'Rent' : item}</span>
          </div>
        ))}
      </div>

      {/* Numbers & Price */}
      <div className='flex flex-wrap gap-6'>
        <div className='flex flex-col gap-1'>
          <label className='font-semibold text-sm'>Beds</label>
          <input
            type='number'
            id='bedrooms'
            min='1'
            max='10'
            required
            className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400'
            onChange={handleChange}
            value={formData.bedrooms}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='font-semibold text-sm'>Baths</label>
          <input
            type='number'
            id='bathrooms'
            min='1'
            max='10'
            required
            className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400'
            onChange={handleChange}
            value={formData.bathrooms}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='font-semibold text-sm'>Regular Price {formData.type === 'rent' && '(₹ / month)'}</label>
          <input
            type='number'
            id='regularPrice'
            min='50'
            max='100000000000'
            required
            className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400'
            onChange={handleChange}
            value={formData.regularPrice}
          />
        </div>
        {formData.offer && (
          <div className='flex flex-col gap-1'>
            <label className='font-semibold text-sm'>Discounted Price {formData.type === 'rent' && '(₹ / month)'}</label>
            <input
              type='number'
              id='discountedPrice'
              min='0'
              max='10000000'
              required
              className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400'
              onChange={handleChange}
              value={formData.discountedPrice}
            />
          </div>
        )}
      </div>
    </div>

    {/* RIGHT SECTION - Images */}
    <div className='flex flex-col flex-1 gap-4'>
      <p className='font-semibold'>
        Images: <span className='font-normal text-gray-600'>The first image will be the cover (max 6)</span>
      </p>

      {/* Upload */}
      <div className='flex gap-4'>
        <input
          onChange={(e) => setFiles(e.target.files)}
          className='p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-slate-400'
          type='file'
          id='images'
          accept='image/*'
          multiple
        />
        <button
          type='button'
          disabled={uploading}
          onClick={handleImageSubmit}
          className='p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:bg-green-50 disabled:opacity-80'
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Uploaded Images Preview */}
      {formData.imageUrls.length > 0 && (
        <div className='flex flex-col gap-3'>
          {formData.imageUrls.map((url, index) => (
            <div key={index} className='flex justify-between items-center border p-2 rounded-lg'>
              <img src={url} alt='listing' className='h-28 w-28 object-contain rounded-lg' />
              <button
                type='button'
                onClick={() => handleRemoveImage(index)}
                className='p-2 text-red-700 rounded-lg uppercase hover:bg-red-50'
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <button
        disabled={loading || uploading}
        className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-3'
      >
        {loading ? "Creating..." : "Create Listing"}
      </button>

      {/* Errors */}
      {imageUploadError && <p className='text-red-700 text-sm'>{imageUploadError}</p>}
      {error && <p className='text-red-700 text-sm'>{error}</p>}
    </div>
  </form>
</main>

  );
}
