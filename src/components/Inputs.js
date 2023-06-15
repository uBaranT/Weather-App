import React, { useState } from 'react'
import { UilSearch, UilLocationPoint } from '@iconscout/react-unicons';
import { toast } from 'react-toastify';

function Inputs({ setQuery,units,setUnits }) {
    const [city,setCity] = useState('');

    const handleUnitsChange = (e) => {
        const selectedUnit =e.currentTarget.name;
        if(units !== selectedUnit) setUnits(selectedUnit);
    };

    const handleSearchClick =()=> {
    if(city !=='') setQuery({ q: city });
    };

    const handleLocationClick= () => {
        if(navigator.geolocation) {
            toast.info('Fetching users location.');

            navigator.geolocation.getCurrentPosition((position) => {
                
                toast.success('Location fetched!');
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;

                setQuery({
                    lat,
                    lon,
                });
            });
        };
    };



    return (
        <div className='flex flex-row justify-center my-6'>
            <div className='flex flex-row w-3/4 items-center justify-center space-x-4'>

                <input
                value={city}
                onChange={(e)=>setCity(e.currentTarget.value)}
                    type={'text'}
                    placeholder='Search for...'
                    className='text-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize placeholder:lowercase '></input>
                {/* *focus:outline-none -> input alanindaki bar'a tikladigimizda cevresinde mavi bir cerceve cikiyordu, onu kapattik.
                    
                    *capitalize -> input alani icerisine bir sey yazmaya basladigimiz zaman ilk harfini otomatik olarak buyuk yaziyor.
                    
                    *placeholder:lowercase -> placeholder olarak 'Search for...' yazmasini istedigimiz icin ve butun harflerin de kucuk
                                              yazilmasini istedigimiz icin placeholder:lowercase dedik.
                     
                     */}
                <UilSearch 
                    size={30} 
                    className='text-white cursor-pointer transition ease-out hover:scale-125'
                    onClick={handleSearchClick} />

                <UilLocationPoint 
                    size={30} 
                    className='text-white cursor-pointer transition ease-out hover:scale-125'
                    onClick ={handleLocationClick} />
                {/* * transition ease-out hover:scale-125-> mouse ile icon'un ustune gelince belirtilen scale degeri kadar buyuyor. Buyume efekti gibi.
        
                 */}
            </div>

            <div className='flex flex-row w-1/4 items-center justify-center'>

                <button 
                name='metric' 
                className='text-xl text-white font-light transition ease-out hover:scale-125'
                onClick={handleUnitsChange}>°C</button>

                <p className='text-white text-2xl mx-1'>|</p>
                {/** mx-1 -> sagdan ve soldan bosluk ekliyor. */}
                <button 
                    name='imperial' 
                    className='text-xl text-white font-light transition ease-out hover:scale-125'
                    onClick={handleUnitsChange}>°F</button>
            </div>
        </div>
    )
}

export default Inputs;