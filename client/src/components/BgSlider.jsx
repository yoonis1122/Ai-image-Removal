import React, { useState } from 'react'
import { assets } from '../assets/assets'

const BgSlider = () => {

    const [sliderPosition, setSliderPosition] = useState(40)

    const handleSliderchange = (e) =>{
        setSliderPosition(Number(e.target.value)) // muhiim ah
    }

  return (
    <div className='pb-10 md:py-20 mx-2'>
        
       <h1 className='mb-12 sm:mb-20 text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent'>
        Remove Background With High <br/> Quality and Accuracy
       </h1>

       <div className='relative w-full max-w-3xl m-auto rounded-xl overflow-hidden h-[400px]'>
         
        {/* background image */}
        <img 
          className='absolute top-0 left-0 w-full h-full object-cover'
          src={assets.image_w_bg} 
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          alt=""
        />

        {/* foreground image */}
        <img 
          className='absolute top-0 left-0 w-full h-full object-cover'
          src={assets.image_wo_bg} 
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          alt=""
        />

        {/* slider */}
        <input 
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderchange}
          className='absolute top-0 left-0 w-full h-full z-10 slider cursor-pointer'
        />

       </div>
    </div>
  )
}

export default BgSlider