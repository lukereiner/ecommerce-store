import React from 'react'

const Navbar = () => {
  return (
   <>
    <nav className='flex items-center justify-between p-4 bg-white shadow text-black'>
        <div className='w-1/3 flex justify-start'>
            <a href='#' className='text-xl font-bold'>General Store</a>
        </div>
        
        <div className='w-1/3 flex justify-center space-x-6'>
            <a href="#" className='hover:text-blue-600'>Home</a>
            <a href="#" className='hover:text-blue-600'>About</a>
            <a href="#" className='hover:text-blue-600'>Store</a>
            <a href="#" className='hover:text-blue-600'>Home</a>
        </div>
    </nav>
   </>
  )
}

export default Navbar