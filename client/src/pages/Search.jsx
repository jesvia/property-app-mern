import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Search() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    console.log(listings);
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc'
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search); 
        const searchTermFromURL = urlParams.get('searchTerm');
        const typeFromURL = urlParams.get('type');
        const parkingFromURL = urlParams.get('parking');
        const furnishedFromURL = urlParams.get('furnished');
        const offerFromURL = urlParams.get('offer');
        const sortFromURL = urlParams.get('sort');
        const orderFromURL = urlParams.get('order');

        if(searchTermFromURL || typeFromURL || parkingFromURL || furnishedFromURL || offerFromURL || sortFromURL || orderFromURL) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromURL || '',
                type: typeFromURL || 'all',
                parking: parkingFromURL ==='true'? true : false,
                furnished: furnishedFromURL ==='true'? true : false,
                offer: offerFromURL ==='true'? true : false,
                sort: sortFromURL || 'createdAt',
                order: orderFromURL || 'desc'
            })
        }

        const fetchListings = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            setListings(data);
            setLoading(false);
        }

        fetchListings();
        }, [location.search]);
    const handleChange = (e) => {
        if(e.target.id === 'searchTerm') {
            setSidebarData({
                ...sidebarData,
                [e.target.id]: e.target.value
            })
        }

        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebarData({
                ...sidebarData,
                type: e.target.id
            })
        }

        if(e.target.id === 'offer' || e.target.id === 'parking' || e.target.id === 'furnished') {
            setSidebarData({
                ...sidebarData,
                [e.target.id]: 
                e.target.checked || e.target.checked === 'true' ? true : false
            })
        }

        if(e.target.id == 'sort_order'){
            const sort = e.target.value.split('_')[0] || 'createdAt';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebarData({
                ...sidebarData,
                sort,
                order
            })
        }
    
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();

        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', sidebarData.parking);
        urlParams.set('furnished', sidebarData.furnished);
        urlParams.set('offer', sidebarData.offer);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
  return (
    <div className='flex flex-col md:flex-row'>

{/* Filters */}
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen border-purple-300'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input type="text" 
                    id='searchTerm' placeholder='Search..'
                    className='bg-purple-100 rounded-lg w-full p-2 text-xs placeholder:text-[12px] placeholder:font-extralight border-0 focus:outline-purple-400'
                    value={sidebarData.searchTerm}
                    onChange={handleChange}
                    />
                </div>

                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="all" className='w-4'
                        onChange={handleChange}
                        checked={sidebarData.type === 'all'}
                        />
                        <span className='mb-1'>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="rent" className='w-4'
                        onChange={handleChange}
                        checked={sidebarData.type === 'rent'}
                        />
                        <span className='mb-1'>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sale" className='w-4'
                        onChange={handleChange}
                        checked={sidebarData.type === 'sale'}
                        />
                        <span className='mb-1'>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="offer" className='w-4'
                        onChange={handleChange}
                        checked={sidebarData.offer}
                        />
                        <span className='mb-1'>Offer</span>
                    </div>
                </div>

                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Amenities:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="parking" className='w-4'
                        onChange={handleChange}
                        checked={sidebarData.parking}
                        />
                        <span className='mb-1'>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="furnished" className='w-4'
                        onChange={handleChange}
                        checked={sidebarData.furnished}
                        />
                        <span className='mb-1'>Furnished</span>
                    </div>
                </div>

                <div className='flex gap-2 items-center'>
                    <label className='font-semibold'>Sort:</label>
                    <select 
                    id="sort_order" 
                    className='bg-purple-100 rounded-lg p-1 focus:outline-purple-400'
                    onChange={handleChange}
                    defaultValue={'createdAt_desc'}
                    >
                        <option value={'regularPrice_desc'}>Price high to low</option>
                        <option value={'regularPrice_asc'}>Price low to high</option>
                        <option value={'createdAt_desc'}>Latest</option>
                        <option value={'createdAt_asc'}>Oldest</option>
                    </select>
                </div> 

                <button 
                className='bg-purple-500 text-white p-2 rounded-lg cursor-pointer hover:opacity-65 uppercase'>
                Search
                </button>
            </form>
        </div>


{/* Results */}
        <div>
            <h1 className='text-3xl text-purple-600 mt-5 font-semibold p-3 border-b border-gray-200'>
                Listing Results:
            </h1>
        </div>
    </div>
  )
}
