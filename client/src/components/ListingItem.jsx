import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Tag } from 'lucide-react';

export default function ListingItem({ listing, variant = 'grid' }) {
  const isList = variant === 'list';

  const price =
    listing.offer && listing.discountedPrice
      ? listing.discountedPrice
      : listing.regularPrice;

  return (
    <Link
      to={`/listing/${listing._id}`}
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden w-full
      ${
        isList
          ? 'flex flex-col sm:flex-row gap-4 p-3'
          : 'w-72 flex flex-col p-3'
      }`}
    >
      {/* IMAGE */}
      <div
        className={`relative overflow-hidden rounded-lg
        ${
          isList
            ? 'w-full h-48 sm:w-48 sm:h-32 flex-shrink-0'
            : 'h-48 w-full'
        }`}
      >
        <img
          src={listing.imageUrls[0]}
          alt="Listing"
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />

        {listing.offer && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <Tag size={12} />
            Offer
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col justify-between gap-2 text-slate-700 flex-1 min-w-0">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold truncate">
            {listing.name}
          </h3>

          <div className="flex items-center gap-1 text-sm text-gray-500 truncate">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{listing.address}</span>
          </div>

          {!isList && (
            <p className="text-sm text-gray-500 line-clamp-2">
              {listing.description}
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
          <p className="text-lg font-bold text-slate-800 whitespace-nowrap">
            ₹{price.toLocaleString()}
            {listing.type === 'rent' && (
              <span className="text-sm text-gray-500"> / month</span>
            )}
          </p>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BedDouble size={16} />
              {listing.bedrooms}
            </div>
            <div className="flex items-center gap-1">
              <Bath size={16} />
              {listing.bathrooms}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
