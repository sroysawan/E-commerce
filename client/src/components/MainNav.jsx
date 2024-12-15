import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import {
  History,
  LogOut,
  Menu,
  ShoppingBasket,
  User,
  UserRoundPen,
  X,
} from "lucide-react";
import Icon from "../assets/icon.png";
import Badge from "@mui/material/Badge";
import SearchText from "./ui/SearchText";
import { Search } from "lucide-react";
const MainNav = () => {
  const carts = useEcomStore((state) => state.carts);
  const user = useEcomStore((state) => state.user);
  const actionLogout = useEcomStore((state) => state.actionLogout);
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const logoutRedirect = () => {
    actionLogout();
    navigate("/login");
    setIsProfileOpen(false);
  };

  // Define the handleSearch function
  // const handleSearch = (query) => {
  //   if (query.trim() !== "") {
  //     navigate(`/product?query=${encodeURIComponent(query)}`);
  //     setIsSearchOpen(false); // Close popup after search
  //   }
  // };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-30">
      <div className="container mx-auto px-2 sm:px-2 md:px-0 lg:px-2 xl:px-0 flex h-20 items-center gap-8">
        <Link
          to={"/"}
          className="text-red-500 flex items-center justify-center gap-3"
        >
          <img src={Icon} className="w-8 md:w-10" alt="Logo" />
          <p className="font-black text-lg xl:text-xl py-1">E-commerce</p>
        </Link>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          {/* Desktop Menu */}
          <nav className="hidden md:flex md:flex-1 md:justify-between">
            <ul className="flex items-center gap-6 text-md">
              <li>
                <NavLink
                  to={"/"}
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "text-red-600 font-semibold"
                      : "text-gray-500 transition hover:text-red-500"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/shop"}
                  className={({ isActive }) =>
                    isActive
                      ? "text-red-600 font-semibold"
                      : "text-gray-500 transition hover:text-red-500"
                  }
                >
                  Shop
                </NavLink>
              </li>
            </ul>
            <div className="hidden lg:flex items-center">
              <SearchText setIsSearchOpen={setIsSearchOpen} />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSearch}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 hover:text-red-500"
                aria-label="search"
              >
                <Search size={20} />
              </button>
              <div className="relative flex items-center justify-center">
                <NavLink
                  to={"/cart"}
                  className={({ isActive }) =>
                    `w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 transition ${
                      isActive ? "text-red-600" : "hover:text-red-500"
                    }`
                  }
                >
                  <ShoppingBasket />
                  {carts.length > 0 && (
                    <span className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-xs px-1.5 py-0.5">
                      {carts.length}
                    </span>
                  )}
                </NavLink>
              </div>

              {/* Profile  */}
              <div className="sm:flex sm:gap-4">
                {user ? (
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleProfile}
                        aria-label={`โปรไฟล์ของ ${
                          user.name.substring(0, user.name.indexOf(" ")) ||
                          user.name
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 hover:border-red-500">
                            <User />
                          </div>
                          <span className=" text-red-600 transition hover:text-red-500">
                            {user.name.substring(0, user.name.indexOf(" ")) ||
                              user.name}
                          </span>
                        </div>
                      </button>
                    </div>

                    {isProfileOpen && (
                      <>
                        <div
                          className="fixed inset-0 bg-transparent z-10 hidden md:block"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <div className="absolute top-10 right-0 z-20 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-xl">
                          {user.role === "admin" && (
                            <div className="p-2">
                              <NavLink
                                to={"/admin"}
                                className="p-2 flex items-center gap-2 rounded-lg  text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                              >
                                <UserRoundPen />
                                Dashboard Admin
                              </NavLink>
                            </div>
                          )}
                          <div className="p-2">
                            <NavLink
                              to={"/user/history"}
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
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <NavLink
                      to={"/register"}
                      className={({ isActive }) =>
                        isActive
                          ? "hidden rounded-md bg-gray-300 px-5 py-2.5 text-sm font-medium text-teal-700 transition shadow-lg  sm:block"
                          : "hidden rounded-md bg-gray-200 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-700 hover:bg-gray-300 sm:block"
                      }
                    >
                      Register
                    </NavLink>
                    <NavLink
                      to={"/login"}
                      className={({ isActive }) =>
                        isActive
                          ? "block rounded-md bg-teal-700 px-5 py-2.5 shadow-lg text-sm font-medium text-white transition "
                          : "block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                      }
                    >
                      Log in
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex gap-4">
            <button
              onClick={toggleSearch}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 hover:text-red-500"
              aria-label="search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={toggleProfile}
              className="text-gray-600 hover:text-red-500"
              aria-label="hamberger menu"
            >
              {isProfileOpen ? (
                <X size={28} />
              ) : (
                <div className="relative">
                  <Menu size={28} />
                  {carts.length > 0 && (
                    <span className="absolute -top-3 -right-1 rounded-full px-1.5 py-0.5 text-center text-xs bg-red-500 text-white">
                      {carts.length}
                    </span>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Popup for Mobile/Tablet */}
      {isSearchOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleSearch}
          />
          <div className="fixed inset-x-0 top-0 bg-white p-4 shadow-lg z-50 animate-slide-down">
            <div className="container mx-auto ">
              <div className="flex justify-center items-center gap-4">
                <SearchText setIsSearchOpen={setIsSearchOpen} />
                <button
                  onClick={toggleSearch}
                  className="p-2 hover:text-red-500"
                  aria-label="close search"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Overlay for Mobile Menu */}
      {isProfileOpen && (
        <div
          className="fixed inset-0  bg-transparent z-20 md:hidden"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      {/* Hamburger Menu Content */}
      {isProfileOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-lg z-20 md:hidden">
          <ul className="flex flex-col items-center gap-4 py-4">
            {user && (
              <li>
                <span className=" text-red-600 transition hover:text-red-500 text-xl">
                  {user.name.substring(0, user.name.indexOf(" ")) || user.name}
                </span>
              </li>
            )}
            <li>
              <NavLink
                to={"/"}
                end
                onClick={() => setIsProfileOpen(false)}
                className="text-gray-600 hover:text-red-500"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/shop"}
                onClick={() => setIsProfileOpen(false)}
                className="text-gray-600 hover:text-red-500"
              >
                Shop
              </NavLink>
            </li>
            <li className="relative">
              <NavLink
                to={"/cart"}
                onClick={() => setIsProfileOpen(false)}
                className="text-gray-600 hover:text-red-500"
              >
                Cart
              </NavLink>
              {carts.length > 0 && (
                <span className="absolute -top-3 -right-4 rounded-full px-1.5 py-0.5 text-xs bg-red-500 text-white">
                  {carts.length}
                </span>
              )}
            </li>
            {user ? (
              <>
                <li>
                  <NavLink
                    to={"/user/history"}
                    onClick={() => setIsProfileOpen(false)}
                    className="text-gray-600 hover:text-red-500"
                  >
                    History
                  </NavLink>
                </li>
                {user.role === "admin" && (
                  <li>
                    <NavLink
                      to={"/admin"}
                      onClick={() => setIsProfileOpen(false)}
                      className="text-gray-600 hover:text-red-500"
                    >
                      Dashboard Admin
                    </NavLink>
                  </li>
                )}

                <li>
                  <button
                    onClick={logoutRedirect}
                    className="text-red-600 hover:bg-red-100 px-12 py-2 rounded-lg"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to={"/register"}
                    onClick={() => setIsProfileOpen(false)}
                    className="text-gray-600 hover:text-red-500"
                  >
                    Register
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/login"}
                    onClick={() => setIsProfileOpen(false)}
                    className="text-gray-600 hover:text-red-500"
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default MainNav;
