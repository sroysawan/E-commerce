import React from "react";
import { dateFormat } from "../../../utils/dateFormat";
import SkeletonLoaderTable from "../../ui/Skeletons/SkeletonLoaderTable";
import useEcomStore from "../../../store/ecom-store";

const UserTableMobile = ({
  isFirstLoad,
  toggleSortUser,
  allUsers,
  pageUser,
  limitUser,
  handelChangeUserRole,
  handleChangeUserStatus,
}) => {
  const token = useEcomStore((state) => state.token);

  return (
    <div className="xl:hidden">
      <div className="flex justify-between gap-2 mb-3">
        <button
          onClick={() => toggleSortUser("createdAt")}
          className="px-2 py-1.5 bg-blue-500 text-xs text-white rounded hover:bg-blue-600"
        >
          Sort by Date
        </button>
        <button
          onClick={() => toggleSortUser("name")}
          className="px-2 py-1.5 bg-blue-500 text-xs text-white rounded hover:bg-blue-600"
        >
          Sort by Name
        </button>
        <button
          onClick={() => toggleSortUser("enabled")}
          className="px-2 py-1.5 bg-blue-500 text-xs text-white rounded hover:bg-blue-600"
        >
          Sort by Status
        </button>
      </div>
      {isFirstLoad ? (
        <SkeletonLoaderTable rows={5} columns={8} />
      ) : allUsers?.length > 0 ? (
        allUsers.map((item, index) => (
          <div
            key={item.id}
            className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                {index + 1 + (pageUser - 1) * limitUser}. {item.name}
              </span>
              <span
                className={`text-xs font-bold ${
                  item.enabled ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.enabled ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Email: {item.email}</p>
            <p className="text-gray-600 text-sm mb-1">
              สมัครเมื่อ: {dateFormat(item.createdAt)}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              แก้ไขล่าสุด: {dateFormat(item.updatedAt)}
            </p>
            <div className="flex justify-between items-center mt-2">
              <select
                onChange={(e) =>
                  handelChangeUserRole(token, item.id, e.target.value)
                }
                value={item.role}
                className="border rounded-md text-sm py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                className={`py-1 px-3 rounded-md text-sm text-white shadow-md transform transition-transform duration-200 ${
                  item.enabled
                    ? "bg-red-500 hover:bg-red-600 hover:scale-105"
                    : "bg-green-500 hover:bg-green-600 hover:scale-105"
                }`}
                onClick={() =>
                  handleChangeUserStatus(token, item.id, item.enabled)
                }
              >
                {item.enabled ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4">ไม่พบผู้ใช้งาน</div>
      )}
    </div>
  );
};

export default UserTableMobile;
