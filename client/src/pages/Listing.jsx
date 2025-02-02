import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
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
            </div>
            )
            
        }
    </main>
  );
}
