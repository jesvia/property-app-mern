import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
    const {currentUser} = useSelector((state) => state.user);
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        location: '',
        type: 'rent',
        regularPrice: 25,
        discountPrice: 0,
        bathrooms: 1,
        bedrooms: 1,
        offer: false,
        parking: false,
        furnished: false
    });

    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false); 
    const[error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    console.log(formData);
    const handleImageUpload = (e) => {
        if(files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            } 
            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData,
                    imageUrls: formData.imageUrls.concat(urls)
                });
            setImageUploadError(false);
            setUploading(false);
            }).catch((error) => {
                setImageUploadError('Image upload failed - 2 MB max per image');
                setUploading(false);
            });
        } else {
            setImageUploadError('Only 6 images allowed per listing');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            )
        });
    }
    const handleDeleteImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            })
        }
        if (e.target.id === 'offer' || e.target.id === 'parking' || e.target.id === 'furnished') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }
        if (e.target.type === 'number' || e.target.type === 'text'|| e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
        
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) {
                return setError('Please upload at least one image');
            }
            if (+formData.discountPrice > +formData.regularPrice) {
                return setError('Discount price must be less than regular price');
            }
            setLoading(true);
            setError(false);
            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            });
            const data = res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
                return;
            }
            navigate(`/listings/${currentUser._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7 text-purple-700'>Create A Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='text-center flex flex-col  flex-1 gap-3'>
                <input id='name' type="text" placeholder='Name' onChange={handleChange} value={formData.name} className='border p-3 border-transparent bg-white rounded-lg' maxLength='100' minLength='3' required/>
                <input id='description' type="text" placeholder='Description' onChange={handleChange} value={formData.description} className='border p-3 border-transparent bg-white rounded-lg' required/>
                <input id='location' type="text" placeholder='Location'onChange={handleChange} value={formData.location} className='border p-3 border-transparent bg-white rounded-lg' required/>
                <div className='flex gap-5 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='sale' onChange={handleChange} checked={formData.type === 'sale'} className='w-5' />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='rent' onChange={handleChange} checked={formData.type === 'rent'} className='w-5' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='parking' className='w-5' onChange={handleChange} checked={formData.parking}/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished} />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={formData.offer}/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6 items-center mt-3'>
                    <div className='flex gap-2 items-center'>
                        <input type="number" id='bedrooms' onChange={handleChange} value={formData.bedrooms} min='1' max='20' required className='border p-2 border-transparent bg-white rounded-lg'/>
                        <span>Bedrooms</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input type="number" id='bathrooms' onChange={handleChange} value={formData.bathrooms} min='1' max='20' required className='border p-2 border-transparent bg-white rounded-lg'/>
                        <span>Bathrooms</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input type="number" id='regularPrice' min='25' onChange={handleChange} value={formData.regularPrice} required className='border p-2 border-transparent bg-white rounded-lg'/>
                        <div className='flex flex-col items-center'>
                        <span>Regular Price</span>
                        {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
                        {formData.type === 'sale' && <span className='text-xs'>($)</span>}
                        </div>
                    </div>
                    {
                    formData.offer &&
                     <div className='flex gap-2 items-center'>
                     <input type="number" id='discountPrice' min='0' onChange={handleChange} value={formData.discountPrice} required className='border p-2 border-transparent bg-white rounded-lg'/>
                     <div className='flex flex-col items-center'>
                     <span>Discount Price</span>
                     {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
                     {formData.type === 'sale' && <span className='text-xs'>($)</span>}
                     </div>
                 </div>
                 }
                   
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='text-semibold'>Images:
                    <span className='text-xs font-extralight text-gray-600 ml-2'>first image will be the cover (max 6)</span>
                </p>
                <div className='flex gap-3'>
                    <input onChange={(e)=> setFiles(e.target.files)} type="file" id='images' accept='image/*' multiple required className='border p-3 border-transparent w-full bg-white rounded-lg hover:file:cursor-pointer hover:file:text-blue-700 file:bg-purple-300 file:text-xs file:font-medium file:p-2 file:rounded-lg' />
                    <button type="button" onClick={handleImageUpload} disabled={uploading} className='p-3 uppercase bg-purple-500 text-white rounded-lg hover:shadow-lg hover:opacity-65 hover:cursor-pointer disabled:opacity-50'>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                <p className="text-red-600 text-sm text-right">{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div key={url} className="flex justify-between p-3 border items-center border-purple-400 rounded-lg">
                            <img src={url} alt="listing image" className="w-25 h-25 object-contain rounded-lg" />
                            <button type="button" onClick={()=>handleDeleteImage(index)} className="p-3 uppercase  text-red-600 rounded-lg hover:opacity-55 hover:cursor-pointer">Delete</button>
                        </div>
                    ))
                }
                <button disabled={loading || uploading} className='p-3 uppercase font-bold bg-cyan-400 text-white rounded-lg hover:shadow-lg hover:opacity-55 hover:cursor-pointer disabled:opacity-40'>
                    {loading ? 'Creating Listing...' : 'Create Listing'}
                    </button>
                {error && <p className="text-red-600 text-sm text-right">{error}</p>}
            </div>
        </form>
    </main>
  )
}
