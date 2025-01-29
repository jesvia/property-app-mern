import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 text-purple-700'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" placeholder='username' className='border border-transparent p-3 rounded-lg bg-purple-100' id="username" />
        <input type="text" placeholder='email' className='border  border-transparent p-3 rounded-lg  bg-purple-100' id="email" />
        <input type="text" placeholder='password' className='border  border-transparent p-3 rounded-lg  bg-purple-100' id="password" />
        <button className='bg-purple-500 text-white p-3 rounded-lg uppercase hover:opacity-65 disabled:opacity-50'>Sign Up</button>
      </form>
      <div className='flex gap-2 items-center mt-5'>
        <p>Already have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-purple-700'>Sign In</span>
        </Link>
      </div>
    </div>
  )
}
