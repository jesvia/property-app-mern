import { useState } from 'react'
import { useSelector } from 'react-redux';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 text-purple-700'>Profile</h1>
      <form className='flex flex-col gap-4'>
      <img className='rounded-full h-24 w-24 object-cover self-center cursor-pointer mt-2 mx-auto' src={currentUser.avatar} alt='profile' />
      <input type="text" id="username" className='border border-transparent p-3 rounded-lg bg-purple-100'  onChange={handleChange} value={currentUser.username}/>
      <input type="email"  id="email" disabled className='border  border-transparent p-3 rounded-lg  bg-purple-100'  onChange={handleChange} value={currentUser.email}/>
      <input type="password" id="password" placeholder='password' className='border  border-transparent p-3 rounded-lg  bg-purple-100'  onChange={handleChange}/>
      <button className='bg-purple-500 text-white p-3 rounded-lg uppercase hover:opacity-65 disabled:opacity-50'>Update</button>
      </form>
      <div className='flex justify-between mt-2'>
        <span className='text-red-600 cursor-pointer'>Delete Account</span>
        <span className='text-cyan-500 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
