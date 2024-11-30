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
const MainNav = () => {
  const carts = useEcomStore((state) => state.carts);
  const user = useEcomStore((state) => state.user);
  const actionLogout = useEcomStore((state) => state.actionLogout);
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    actionLogout();
    navigate("/login");
    setIsMenuOpen(false);
  };

    // Define the handleSearch function
    const handleSearch = (query) => {
      if (query.trim() !== "") {
        navigate(`/product?query=${encodeURIComponent(query)}`);
      }
    };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="mx-2 md:container md:mx-auto flex h-20 items-center gap-8">
        <Link
          to={"/"}
          className="text-red-500 flex items-center justify-center gap-3"
        >
          <img src={Icon} className="w-10" alt="Logo" />
          <p className="font-black text-xl py-1">E-commerce</p>
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
                      ? "text-red-500 font-semibold"
                      : "text-gray-500 transition hover:text-red-400"
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
                      ? "text-red-500 font-semibold"
                      : "text-gray-500 transition hover:text-red-400"
                  }
                >
                  Shop
                </NavLink>
              </li>
            </ul>
            <div className="flex items-center">
              <SearchText onSearch={handleSearch}/>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <NavLink
                  to={"/cart"}
                  className={({ isActive }) =>
                    `w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 transition ${
                      isActive
                        ? "text-red-500"
                        : "hover:text-red-500"
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

              <div className="sm:flex sm:gap-4">
                {user ? (
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
                          <span className=" text-red-500 transition hover:text-red-700">
                            {user.name.substring(0, user.name.indexOf(' ')) || user.name}
                          </span>
                        </div>
                      </button>
                    </div>
                    {isOpen && (
                      <div className="absolute top-10 right-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-xl">
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
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-red-500"
            >
              {isMenuOpen ? (
                <X size={28} />
              ) : (
                <div className="relative">
                  <Menu size={28} />
                  {carts.length > 0 && (
                    <span className="absolute -top-3 -right-1 rounded-full px-2 py-0.5 text-center text-xs bg-red-500 text-white">
                      {carts.length}
                    </span>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hamburger Menu Content */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-lg z-20 md:hidden">
          <ul className="flex flex-col items-center gap-4 py-4">
            {user &&
            <li>
              <span className=" text-red-500 transition hover:text-red-700 text-xl">
                {user.name}
              </span>
            </li>
            }
            <li>
              <NavLink
                to={"/"}
                end
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-red-500"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/shop"}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-red-500"
              >
                Shop
              </NavLink>
            </li>
            <li className="relative">
              <NavLink
                to={"/cart"}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-red-500"
              >
                Cart
              </NavLink>
              {carts.length > 0 && (
                <span className="absolute -top-3 -right-4 rounded-full px-2 text-xs bg-red-500 text-white">
                  {carts.length}
                </span>
              )}
            </li>
            {user ? (
              <>
                <li>
                  <NavLink
                    to={"/user/history"}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 hover:text-red-500"
                  >
                    History
                  </NavLink>
                </li>
                {user.role === "admin" && (
                          <li>
                            <NavLink
                              to={"/admin"}
                              onClick={() => setIsMenuOpen(false)}
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
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 hover:text-red-500"
                  >
                    Register
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/login"}
                    onClick={() => setIsMenuOpen(false)}
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
