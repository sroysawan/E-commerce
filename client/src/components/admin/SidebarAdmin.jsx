import React from "react";
import { NavLink } from "react-router-dom";
import { ChartBarStacked, ChartNoAxesGantt, LayoutDashboard, LogOut, ShoppingCart } from "lucide-react";
const SidebarAdmin = () => {
  return (
    <div className="bg-gray-700 text-gray-100 w-64 flex flex-col h-screen">
      <div className="h-24 bg-gray-900 flex items-center justify-center text-lg font-bold">
        Admin Panel
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavLink
          to={"/admin"}
          end
          className={({isActive}) =>
            isActive
              ? "bg-gray-900 text-white px-4 py-2 rounded-md flex items-center"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <LayoutDashboard className="mr-2" />
          Dashboard
        </NavLink>
        <NavLink
          to={"manage"}
          className={({isActive}) =>
            isActive
              ? "bg-gray-900 text-white px-4 py-2 rounded-md flex items-center"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <ChartNoAxesGantt className="mr-2" />
          Manage
        </NavLink>
        <NavLink
          to={"category"}
          className={({isActive}) =>
            isActive
              ? "bg-gray-900 text-white px-4 py-2 rounded-md flex items-center"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <ChartBarStacked className="mr-2" />
          Category
        </NavLink>
        <NavLink
          to={"product"}
          className={({isActive}) =>
            isActive
              ? "bg-gray-900 text-white px-4 py-2 rounded-md flex items-center"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <ShoppingCart className="mr-2" />
          Product
        </NavLink>
      </nav>

      <footer>
      <NavLink
        //   to={"product"}
          className={({isActive}) =>
            isActive
              ? "bg-gray-900 text-white px-4 py-2 rounded-md flex items-center"
              : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <LogOut className="mr-2" />
          Logout
        </NavLink>
      </footer>
    </div>
  );
};

export default SidebarAdmin;
