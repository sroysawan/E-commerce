import React from "react";
import { dateFormat } from "../../../utils/dateFormat";
import useEcomStore from "../../../store/ecom-store";
import SortTable from "../../ui/SortTable";
import SkeletonLoaderTable from "../../ui/Skeletons/SkeletonLoaderTable";

const UserTableDesktop = ({
  isFirstLoad,
  toggleSortUser,
  allUsers,
  sortOrder,
  sortBy,
  pageUser,
  limitUser,
  handelChangeUserRole,
  handleChangeUserStatus,
}) => {
  const token = useEcomStore((state) => state.token);
  return (
    <table className="hidden xl:table  min-w-full  border-collapse bg-white shadow-md ">
      <thead className="bg-blue-600 text-white text-base font-medium">
        <tr>
          <th className="px-6 py-3 w-28 text-center">ลำดับ</th>
          <th className="px-6 py-3 w-60">
            <div className="flex gap-2 items-center justify-start">
              Email
              <SortTable
                toggleSort={toggleSortUser}
                data={"email"}
                sortOrder={sortOrder}
                sortBy={sortBy}
              />
            </div>
          </th>
          <th className="px-6 py-3 w-56">
            <div className="flex gap-2 items-center justify-start">
              ชื่อ
              <SortTable
                toggleSort={toggleSortUser}
                data={"name"}
                sortOrder={sortOrder}
                sortBy={sortBy}
              />
            </div>
          </th>
          <th className="px-6 py-3 w-56">
            <div className="flex gap-2 items-center justify-start">
              วันที่สมัคร
              <SortTable
                toggleSort={toggleSortUser}
                data={"createdAt"}
                sortOrder={sortOrder}
                sortBy={sortBy}
              />
            </div>
          </th>
          <th className="px-6 py-3 w-56">
            <div className="flex gap-2 items-center justify-start">
              วันที่แก้ไขล่าสุด
              <SortTable
                toggleSort={toggleSortUser}
                data={"updatedAt"}
                sortOrder={sortOrder}
                sortBy={sortBy}
              />
            </div>
          </th>
          <th className="px-6 py-3 w-40 text-center">
            <div className="flex gap-2 items-center justify-center">
              สิทธิ์
              <SortTable
                toggleSort={toggleSortUser}
                data={"role"}
                sortOrder={sortOrder}
                sortBy={sortBy}
              />
            </div>
          </th>
          <th className="px-6 py-3 w-40">
            <div className="flex gap-2 items-center justify-center">
              สถานะ
              <SortTable
                toggleSort={toggleSortUser}
                data={"enabled"}
                sortOrder={sortOrder}
                sortBy={sortBy}
              />
            </div>
          </th>
          <th className="px-6 py-3 w-44 text-center">จัดการ</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 text-gray-800">
        {isFirstLoad ? (
          <SkeletonLoaderTable rows={5} columns={8} />
        ) : allUsers?.length > 0 ? (
          allUsers?.map((item, index) => (
            <tr
              key={item.id}
              className="odd:bg-gray-100 even:bg-white hover:bg-gray-100 text-sm transition duration-200"
            >
              <td className="px-6 py-3 text-center">
                {index + 1 + (pageUser - 1) * limitUser}
              </td>
              <td className="px-6 py-3">{item.email}</td>
              <td className="px-6 py-3">{item.name}</td>
              <td className="px-6 py-3">{dateFormat(item.createdAt)}</td>
              <td className="px-6 py-3">{dateFormat(item.updatedAt)}</td>
              <td className="px-6 py-3 text-center">
                <select
                  onChange={(e) =>
                    handelChangeUserRole(token, item.id, e.target.value)
                  }
                  value={item.role}
                  className="border rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td
                className={`px-6 py-3 text-center font-bold ${
                  item.enabled ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.enabled ? "Active" : "Inactive"}
              </td>
              <td className="px-6 py-3 text-center">
                <button
                  className={`px-4 py-2 rounded-md text-white shadow-md transform transition-transform duration-200 ${
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
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center py-4">
              ไม่พบผู้ใช้งาน
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserTableDesktop;
