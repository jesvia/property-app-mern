import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function Contact({listing}) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchLandlord();

    }, [listing.userRef]);

    const onChange = (e) => {
        setMessage(e.target.value);
    }
  return (
    <>
    {landlord && (
        <div className="flex flex-col gap-2">
            <p>Contact  <span className="font-bold">{landlord.username} </span> for {" "}
            <span className="font-bold">{listing.name}</span> </p>
            <textarea name="message" id="message" className="bg-purple-200 w-full p-3 text-xs placeholder:text-[12px] placeholder:font-extralight border-0 focus:outline-purple-400" 
            value={message} onChange={onChange}
            rows={2} placeholder="write your message for the landlord here ..."></textarea>

            <Link to={`mailto:${landlord.email}?Subject=Regarding ${listing.name}&body=${message}`} 
            className='uppercase  text-sm bg-cyan-600 text-white text-center mt-3 p-3 rounded-md cursor-pointer hover:opacity-55'>
            Send Message
            </Link>
        </div>
    )}
    
    
    </>
  )
}
