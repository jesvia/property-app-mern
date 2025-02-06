import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';

import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';


export default function Listing() {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const {currentUser} = useSelector((state) => state.user);
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/getListing/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    console.log(data.message);
                    setError(true);
                    setLoading(false);
                    return;
                }
                setLoading(false);
                setListing(data);
                setError(false);
                
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchListing();
    },  [params.listingId]);

  return (
    <main>
        {loading && <p className='text-center my-7 text-xl text-purple-500'>Loading...</p>}
        {error && <p className='text-center my-7 text-xl text-red-500'>Something went wrong...</p>}
        {listing && !loading && !error && 
            (
            <div>
            <Swiper navigation>
                {
                    listing.imageUrls.map(url => (

                        <SwiperSlide key={url}>
                                <div className='h-[500px]' style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
                        </SwiperSlide>

                        )
                        
                    )
                }
            </Swiper>
            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                <FaShare className='text-purple-500 hover:text-green-500' onClick={()=> {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => {
                        setCopied(false);
                    }, 2000);
                    }
                }/>
            </div>
            <div  className='flex flex-col  mx-auto items-center p-3 my-7 gap-4'>
                <p className='text-2xl font-semibold text-purple-600'> 
                    {listing.name} - ${''}
                    {listing.offer ?
                listing.discountPrice.toLocaleString('en-US') 
                : listing.regularPrice.toLocaleString('en-US')}   
                {listing.type === 'rent' && ' / Month'}
                </p>
                <p className='flex items-center mt-2 gap-2 text-slate-600  text-sm'>
                <FaMapMarkerAlt className='text-green-700' />
                        {listing.location}
                </p>
                <div className='flex gap-4 justify-between'>
              <p className='bg-purple-900 w-[200px] text-white text-center p-3 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-700  w-[200px] text-white text-center p-3 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice}
                </p>
              )}
            </div>
            <p className='text-slate-600'>
              <span className='font-semibold text-black'>Description: </span>
              {listing.description}
            </p>
            <ul className='text-purple-700 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} bedrooms `
                  : `${listing.bedrooms} bedroom `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} bathrooms `
                  : `${listing.bathrooms} bathroom `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
              </ul>
              {currentUser &&  listing.userRef !== currentUser._id && !contact && (
            <button onClick={()=> setContact(true)} className='bg-cyan-500 text-white text-center mt-3 p-3 rounded-md cursor-pointer hover:opacity-55'>Contact Landlord</button>                
            )}
            {contact && <Contact listing={listing}/>}
              </div>
            </div>
            )
            
        }
    </main>
  );
}
