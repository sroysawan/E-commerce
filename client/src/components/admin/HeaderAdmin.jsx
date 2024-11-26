import React, { useEffect, useRef, useState } from 'react'
import useEcomStore from '../../store/ecom-store'
import { History, LogOut, Store, User } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

const HeaderAdmin = () => {
  const user = useEcomStore((state)=> state.user)
  const actionLogout = useEcomStore((state) => state.actionLogout);
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Function to handle outside click
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // useEffect to add and clean up the event listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logoutRedirect = () => {
    actionLogout()
    navigate('/login')
  }
  return (
    <header className='bg-white h-16 flex items-center px-6 justify-end'>
      <div className="container mx-auto flex h-16 items-center justify-end gap-8">
            <div className="sm:flex sm:gap-4">
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className=""
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 hover:border-red-500">
                          <User />
                        </div>
                        <span className=" text-gray-500 transition hover:text-gray-700">
                          {user.name}
                        </span>
                      </div>
                    </button>
                  </div>
                  {isOpen && (
                    <div className="absolute top-10 right-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-xl">
                      <div className="p-2">
                        <NavLink
                          to={'/'}
                          className="p-2 flex items-center gap-2 rounded-lg  text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                          <Store/>
                          Home
                        </NavLink>
                      </div>
                      <div className="p-2">
                        <NavLink
                          to={'/user/history'}
                          className="p-2 flex items-center gap-2 rounded-lg  text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                          <History />
                          History
                        </NavLink>
                      </div>
                      <div className="p-2 flex items-center gap-2">
                        <button
                          onClick={logoutRedirect}
                          className="w-full p-2 flex items-center gap-2  rounded-lg  text-sm text-red-700 hover:bg-red-100"
                        >
                          <LogOut className="text-red-700" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
    </header>
  )
}

export default HeaderAdmin
