import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChartBarStacked,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  ShoppingCart,
  UserRoundCog,
} from "lucide-react";
import useEcomStore from "../../store/ecom-store";
const SidebarAdmin = () => {
  const actionLogout = useEcomStore((state) => state.actionLogout);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="md:hidden fixed top-3 left-2 z-40 md:z-50 text-gray-600 hover:text-red-500 p-2"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "" : <Menu size={28}/>}
      </button>

      {/* Sidebar */}
      <div className={`fixed md:relative inset-y-0 left-0 z-50 md:z-40  bg-gray-900 text-gray-100 w-52 md:w-72 transform
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} md:translate-x-0 transition-transform duration-300 ease-in-out
        `}>
        <div className="h-24 bg-gray-900 flex flex-col items-center justify-center text-lg md:text-2xl font-bold">
          <p>Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <NavLink
            to={"/admin"}
            end
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
            onClick={()=> toggleSidebar(false)}
          >
            <LayoutDashboard className="mr-2" />
            Dashboard
          </NavLink>
          <NavLink
            to={"manage"}
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
            onClick={()=> toggleSidebar(false)}
          >
            <UserRoundCog className="mr-2" />
            Manage
          </NavLink>
          <NavLink
            to={"category"}
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
            onClick={()=> toggleSidebar(false)}
          >
            <ChartBarStacked className="mr-2" />
            Category
          </NavLink>
          <NavLink
            to={"product"}
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
            onClick={()=> toggleSidebar(false)}
          >
            <ShoppingCart className="mr-2" />
            Product
          </NavLink>

          <NavLink
            to={"orders"}
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
            onClick={()=> toggleSidebar(false)}
          >
            <ListOrdered className="mr-2" />
            Orders
          </NavLink>
        </nav>
       </div>

       {/* Overlay for Sidebar in Mobile */}
       {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default SidebarAdmin;
