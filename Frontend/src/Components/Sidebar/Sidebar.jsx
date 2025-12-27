import React, { useState } from 'react'
import { Menu, X, ListTodo, Settings, LogOut } from 'lucide-react'
import avatarImage from "/avatar.png"
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../Store/auth-store'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { authUser, Logout } = useAuthStore()

  return (
    <>
 
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white-600 text-black p-2 rounded-lg "
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

  
      <div className={`fixed md:relative w-64 h-screen bg-white text-black p-6 transition-all duration-300 ${isOpen ? 'left-0' : '-left-64'} md:left-0 z-40`}>
        
   
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-white p-2 rounded-lg cursor-pointer">
            <Menu className="w-5 h-5 text-black" />
          </div>
        </div>

  
        <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-8">
          <div className="flex items-center flex-col gap-3">
            <img 
              src={authUser.profilPic || avatarImage} 
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
            <div>
              <h2 className="font-semibold text-md">{authUser?.fullName || 'User'}</h2>
              <p className="text-xs text-[#707888]">{authUser?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        <hr className="border-blue-400 mb-6" />

        {/* Navigation Links */}
        <nav className="space-y-3 flex-1">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition duration-200 active:bg-white active:bg-opacity-30"
          >
            <ListTodo className="w-5 h-5" />
            <span className="font-medium">My Tasks</span>
          </Link>

          <Link 
            to="/settings" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition duration-200 active:bg-white active:bg-opacity-30"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        <hr className="border-blue-400 mb-4" />

        {/* Logout Button */}
        <button 
          onClick={Logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 transition duration-200 font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar