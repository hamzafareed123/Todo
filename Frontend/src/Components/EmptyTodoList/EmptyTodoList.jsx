import React from 'react'
import selfie from "/selfie.png"

const EmptyTodoList = () => {
  return (
    <div className='text-gray-800'>
      <div className='flex flex-col mt-20 items-center justify-center gap-6 sm:flex-col lg:flex-row'>
        <img src={selfie} className='w-64 h-64 rounded-lg object-cover '/>
        <p className='text-center max-w-xs font-lato text-sm font-light italic' style={{ fontFamily: 'Lato, sans-serif' }}>Empty as my motivation on Monday 😅. Let’s start adding stuff!</p>
      </div>
    </div>
  )
}

export default EmptyTodoList