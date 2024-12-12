import React from 'react'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>

    <div className='h-screen overflow-hidden flex flex-col justify-center gap-10 items-center'>
      <Outlet></Outlet>
    </div>
    <footer className="bg-gray-900 text-white text-center py-4">
    Made by Devanand
  </footer>
    </>
  )
}

export default App