import React from 'react'
import { Link } from 'react-router-dom'

export default function ListingItem({ listing }) {

  return (
    <div className='h-3/5 w-72 bg-slate-50 shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg cursor-pointer'>
      <Link to={`/listing/${listing._id}`}>
        <img className='w-full h-40 object-contain flex rounded-t-lg hover:scale-105 transition-scale duration-300 '
          src={listing.imageUrls[0]} alt="Listing Image" />
        <div className=' text-slate-700 mt-2 p-3 flex flex-col gap-2 font-semibold'>
          <p className='text-3xl '> {listing.name}</p>
          <p className='mt-2 truncate'>{listing.address}</p>
          <p className='truncate'>{listing.description}</p>
          <p className='text-lg'>
            ₹{listing.offer && listing.discountedPrice ?
              (listing.discountedPrice) : (listing.regularPrice)}/month</p>
          <div className='flex flex-row text-sm gap-6'>
            <p>{`${listing.bedrooms} ${listing.bedrooms > 1 ? 'beds' : 'bed'}`}</p>
            <p>{`${listing.bathrooms} ${listing.bathrooms > 1 ? 'baths' : 'bath'}`}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}
