import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],

    });

    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false); 
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
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7 text-purple-700'>Create A Listing</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='text-center flex flex-col  flex-1 gap-3'>
                <input id='name' type="text" placeholder='Name' className='border p-3 border-transparent bg-white rounded-lg' maxLength='100' minLength='3' required/>
                <input id='description' type="text" placeholder='Description' className='border p-3 border-transparent bg-white rounded-lg' required/>
                <input id='location' type="text" placeholder='Location' className='border p-3 border-transparent bg-white rounded-lg' required/>
                <div className='flex gap-5 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='sale' className='w-5' />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='rent' className='w-5' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='parking' className='w-5' />
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='furnished' className='w-5' />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='offer' className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6 items-center mt-3'>
                    <div className='flex gap-2 items-center'>
                        <input type="number" id='bedrooms' min='1' max='20' required className='border p-2 border-transparent bg-white rounded-lg'/>
                        <span>Bedrooms</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input type="number" id='bathrooms' min='1' max='20' required className='border p-2 border-transparent bg-white rounded-lg'/>
                        <span>Bathrooms</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input type="number" id='regularPrice' min='1' required className='border p-2 border-transparent bg-white rounded-lg'/>
                        <div className='flex flex-col items-center'>
                        <span>Regular Price</span>
                        <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input type="number" id='discountPrice' min='1'  required className='border p-2 border-transparent bg-white rounded-lg'/>
                        <div className='flex flex-col items-center'>
                        <span>Discount Price</span>
                        <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
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
                <button className='p-3 uppercase font-bold bg-cyan-400 text-white rounded-lg hover:shadow-lg hover:opacity-55 hover:cursor-pointer disabled:opacity-40'>Create Listing</button>
            </div>
        </form>
    </main>
  )
}
