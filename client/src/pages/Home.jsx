import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css/bundle';
import {Navigation} from "swiper/modules";
import SwiperCore from "swiper";
import ListingItems from '../components/ListingItems';

const Home = () => {
  const [offerListing, setOfferListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListing);

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListing(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    }

    fetchOfferListing();

    const fetchRentListing = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListing(data);
        fetchSaleListing();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSaleListing = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListing(data);
      } catch (error) {
        console.log(error);
      }
    }

  }, [])

  return (
    <div>
      <div className="flex flex-col gap-6 pt-16 sm:pt-28 pb-16 md:py-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-[#1D24CA] font-bold text-3xl lg:text-6xl'>Find Your next <span className='text-[#C499F3]'>Perfect</span><br /> place width ease</h1>
        <div className="text-gray-400 text-xs sm:text-sm font-semibold">
        EstateEase is the best place to find your next perfect place to liver. <br /> We have a wide range of properties for you to choose from.
        </div>
        <Link to='/search' className='text-sm sm:text-md text-blue-800 font-bold hover:underline'>Let's start now...</Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide>
              <div
                style={{background: `url(${listing.imageUrls[0]}) center no-repeat`,backgroundSize: 'cover',}} className='h-[250px] sm:h-[500px]' key={listing._id}></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/*show listings */}
      <div className="max-w-6xl p-3 mx-auto flex flex-col gap-8 my-10 xl:max-w-[80rem]">
        {offerListing && offerListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-[#1D24CA]">Recent Offers</h2>
              <Link to={'/search?offer=true'} className='text-sm text-[#C499F3] font-semibold hover:underline'>Show More Offers</Link>
            </div>
            <div className="flex flex-wrap gap-4 justify-start md:gap-2 xl:gap-4">
              {offerListing.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl p-3 mx-auto flex flex-col gap-8 my-10 xl:max-w-[80rem]">
        {rentListing && rentListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-[#1D24CA]">Recent Places for Rent</h2>
              <Link to={'/search?type=rent'} className='text-sm text-[#C499F3] font-semibold hover:underline'>Show More places for rent</Link>
            </div>
            <div className="flex flex-wrap gap-4 justify-start md:gap-2 xl:gap-4">
              {rentListing.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10 xl:max-w-[80rem]">
        {saleListing && saleListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-[#1D24CA]">Recent places for sale</h2>
              <Link to={'/search?type=sale'} className='text-sm text-[#C499F3] font-semibold hover:underline'>Show More places for sale</Link>
            </div>
            <div className="flex flex-wrap gap-4 justify-start md:gap-2 xl:gap-4">
              {saleListing.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex justify-center my-4">
        <Link to='/search' className='font-semibold text-[#1D24CA]'>Show All</Link>
      </div>
    </div>
  )
}

export default Home
