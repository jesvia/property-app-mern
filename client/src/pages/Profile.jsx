import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUpError, setFileUpError] = useState(false);
  const [updateSucess, setUpdateSucess] = useState(false);
  const dispatch = useDispatch();
 

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload =  (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      }, 
      (error) =>{
        setFileUpError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({...formData, avatar: downloadURL});
        });
      }
    );
  }
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSucess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
    const handleDeleteUser = async() => {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    }

    const handleSignOut = async() => {
      try {
        dispatch(signOutUserStart());
        const res = await fetch('/api/auth/signout');
        const data = await res.json();
        if (data.success === false) {
          dispatch(signOutUserFailure(data.message));
          return;
        }
        dispatch(signOutUserSuccess(data));
      } catch (error) {
        dispatch(signOutUserFailure(error.message));
      }
    }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 text-purple-700'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} accept='image/*' hidden/>
      <img onClick={()=> fileRef.current.click()} className='rounded-full h-24 w-24 object-cover self-center cursor-pointer mt-2 mx-auto' src={formData.avatar || currentUser.avatar} alt='profile' />
      <p className='text-sm self-center'>
          {fileUpError ? (
            <span className='text-red-700'>
              Error Uploading Image (image must be less than 2 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-cyan-500'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
      <input type="text" id="username" defaultValue={currentUser.username} className='border border-transparent p-3 rounded-lg bg-purple-100'  onChange={handleChange}/>
      <input type="email"  id="email" defaultValue={currentUser.email} className='border  border-transparent p-3 rounded-lg  bg-purple-100'  onChange={handleChange}/>
      <input type="password" id="password" placeholder='password' className='border  border-transparent p-3 rounded-lg  bg-purple-100'  onChange={handleChange}/>
      <button disabled={loading} className='bg-purple-500 text-white p-3 rounded-lg uppercase hover:opacity-65 disabled:opacity-50'>
        {loading? 'Updating...' : 'Update'}
      </button>
      <Link to={'/create-listing'} className='bg-cyan-500 text-white p-3 rounded-lg uppercase hover:opacity-65 text-center'>
      Create Listing
      </Link>
      </form>
      <div className='flex justify-between mt-2'>
        <span onClick={handleDeleteUser} className='text-red-600 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-600 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-600 mt-3'>{error? error : ''}</p>
      <p className='text-green-600'>{updateSucess? 'Profile Updated Successfully!' : ''}</p>
    </div>
  )
}
