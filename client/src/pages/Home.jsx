import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get?offer=true&limit=4`
        );
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get?type=rent&limit=4`
        );
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get?type=sale&limit=4`
        );
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div className="bg-slate-50">
      {/* ================= HERO SECTION ================= */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-24 flex flex-col gap-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800">
            Find your next{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-700">
              perfect
            </span>{" "}
            place
          </h1>

          <p className="text-gray-500 max-w-2xl mx-auto">
            World Estate helps you discover the best homes for rent and sale
            with ease. Trusted listings, verified sellers, and great deals.
          </p>

          <Link
            to="/search"
            className="inline-block mx-auto bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition"
          >
            Start Exploring
          </Link>
        </div>
      </div>

      {/* ================= SWIPER ================= */}
      {offerListings.length > 0 && (
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 3000 }}
          className="mb-14"
        >
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className="h-[450px] bg-center bg-cover relative"
                style={{
                  backgroundImage: `url(${listing.imageUrls[0]})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-xl font-semibold">{listing.name}</h2>
                  <p className="text-sm opacity-90">
                    ₹{listing.regularPrice?.toLocaleString()}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* ================= LISTING SECTIONS ================= */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-16 pb-20">
        {/* OFFERS */}
        {offerListings.length > 0 && (
          <Section
            title="Recent Offers"
            link="/search?offer=true"
            linkText="View all offers"
            listings={offerListings}
          />
        )}

        {/* RENT */}
        {rentListings.length > 0 && (
          <Section
            title="Places for Rent"
            link="/search?type=rent"
            linkText="View rentals"
            listings={rentListings}
          />
        )}

        {/* SALE */}
        {saleListings.length > 0 && (
          <Section
            title="Places for Sale"
            link="/search?type=sale"
            linkText="View properties"
            listings={saleListings}
          />
        )}
      </div>
    </div>
  );
}

/* ================= REUSABLE SECTION COMPONENT ================= */
function Section({ title, link, linkText, listings }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-slate-700">{title}</h2>
        <Link
          to={link}
          className="text-sm text-blue-700 hover:underline font-medium"
        >
          {linkText}
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingItem key={listing._id} listing={listing}  />
        ))}
      </div>
    </div>
  );
}

export default Home;
