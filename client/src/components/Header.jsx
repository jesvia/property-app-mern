import {FaSearch} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className='bg-purple-200 shadow-md shadow-purple-900'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
      <Link to='/'>
      <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-purple-800'> Phenyl</span>
            <span className='text-purple-600'> Properties </span>
        </h1>
        </Link>
        <form className='bg-purple-100 p-2 rounded-lg flex items-center'>
          <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-34 md:w-64'/>
          <FaSearch className='text-purple-800'></FaSearch>
        </form>
        <ul className='flex gap-4'>
        <Link to='/'>
          <li className='hidden sm:inline text-purple-700 hover:font-bold'>Home</li>
        </Link>
        <Link to='/about'>
          <li className='hidden sm:inline text-purple-700 hover:font-bold'>About</li>
          </Link>
          <Link to='/profile'>
          {currentUser ? (
              <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
            ) : (
              <li className='text-purple-700 hover:font-bold'> Sign in</li>
            )}
          </Link>
        </ul>
      </div>
        
    </header>
  )
}
