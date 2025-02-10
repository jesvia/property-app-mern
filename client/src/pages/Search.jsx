import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>

{/* Filters */}
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen border-purple-300'>
            <form className='flex flex-col gap-6'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input type="text" 
                    id='searchTerm' placeholder='Search..'
                    className='bg-purple-100 rounded-lg w-full p-2 text-xs placeholder:text-[12px] placeholder:font-extralight border-0 focus:outline-purple-400'
                    />
                </div>

                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="all" className='w-4'/>
                        <span className='mb-1'>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="rent" className='w-4'/>
                        <span className='mb-1'>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sale" className='w-4'/>
                        <span className='mb-1'>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="offer" className='w-4'/>
                        <span className='mb-1'>Offer</span>
                    </div>
                </div>

                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Amenities:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="parking" className='w-4'/>
                        <span className='mb-1'>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="furnished" className='w-4'/>
                        <span className='mb-1'>Furnished</span>
                    </div>
                </div>

                <div className='flex gap-2 items-center'>
                    <label className='font-semibold'>Sort:</label>
                    <select id="sort_order" 
                    className='bg-purple-100 rounded-lg p-1 focus:outline-purple-400'>
                        <option>Price high to low</option>
                        <option>Price low to high</option>
                        <option>Latest</option>
                        <option>Oldest</option>
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
