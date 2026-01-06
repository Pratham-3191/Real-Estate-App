import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import Contact from '../components/Contact';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [copied, setCopied] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get/${params.listingId}`
        );
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="bg-slate-100 min-h-screen">
      {loading && (
        <div className="text-center my-7 text-2xl text-slate-700">Loading...</div>
      )}
      {error && (
        <p className="text-center my-7 text-2xl text-red-600">
          Something went wrong
        </p>
      )}
      {listing && !loading && !error && (
        <div className="max-w-6xl mx-auto p-4 md:p-6 flex flex-col gap-6">

          {/* SWIPER / IMAGE GALLERY */}
          <div className="relative">
            <Swiper navigation>
              {listing.imageUrls.map((url, idx) => (
                <SwiperSlide key={idx}>
                  <div
                    className="h-64 md:h-[550px] rounded-lg overflow-hidden bg-center bg-no-repeat bg-cover"
                    style={{ backgroundImage: `url(${url})` }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* SHARE BUTTON */}
            <div className="absolute top-3 right-3 z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow cursor-pointer">
              <FaShare
                className="text-slate-600"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              />
            </div>

            {copied && (
              <p className="absolute top-16 right-5 z-10 bg-white px-3 py-1 rounded shadow text-sm text-slate-700">
                Link copied!
              </p>
            )}
          </div>

          {/* LISTING DETAILS */}
          <div className="flex flex-col gap-4 p-3 bg-white rounded-xl shadow-sm">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              {listing.name} - ₹{' '}
              {listing.offer
                ? (listing.discountedPrice ?? 'N/A').toLocaleString('en-US')
                : (listing.regularPrice ?? 'N/A').toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </h1>

            {/* ADDRESS */}
            <p className="flex items-center gap-2 text-slate-600 text-sm md:text-base">
              <FaMapMarkerAlt className="text-green-600" />
              {listing.address}
            </p>

            {/* TYPE & OFFER */}
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="bg-red-600 text-white px-3 py-1 rounded-md text-sm md:text-base">
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
              {listing.offer && (
                <span className="bg-green-600 text-white px-3 py-1 rounded-md text-sm md:text-base">
                  {+listing.regularPrice - +listing.discountedPrice} OFF
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-slate-700 text-base md:text-lg mt-3">
              <span className="font-semibold text-slate-800">Description: </span>
              {listing.description}
            </p>

            {/* FEATURES */}
            <ul className="flex flex-wrap gap-4 text-sm md:text-base font-semibold text-slate-700 mt-3">
              <li className="flex items-center gap-1">
                <FaBed className="text-lg md:text-xl" />
                {listing.bedrooms} {listing.bedrooms > 1 ? 'beds' : 'bed'}
              </li>
              <li className="flex items-center gap-1">
                <FaBath className="text-lg md:text-xl" />
                {listing.bathrooms} {listing.bathrooms > 1 ? 'baths' : 'bath'}
              </li>
              <li className="flex items-center gap-1">
                <FaParking className="text-lg md:text-xl" />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className="flex items-center gap-1">
                <FaChair className="text-lg md:text-xl" />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>

            {/* CONTACT LANDLORD */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 py-3 mt-4 text-base md:text-lg"
              >
                Contact Landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
