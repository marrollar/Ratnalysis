import React from 'react';
import { usePathname } from 'next/navigation';

const GoogleMapComponent = () => {
    const map_api_key = process.env.GOOGLE_MAPS_API_KEY
    return (
        // <div className="w-full h-5/6 px-2.5 flex justify-center items-center ">
        //     <iframe
        //         className='w-full h-full rounded-lg shadow-lg border border-gray-500'
        //         allowFullScreen
        //         loading="lazy"
        //         src={`https://www.google.com/maps/embed/v1/place?key=${map_api_key}&q=Manhattan`}
        //         >
        //     </iframe>
        // </div>
        <div className="w-full h-screen flex-1 px-2 ">
            <iframe
                title="Google Map"
                className="w-full h-full rounded-lg "
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=${map_api_key}&q=Manhattan`}
            />
        </div>
    )

};

export default GoogleMapComponent;