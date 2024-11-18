import React, { useEffect, useState } from "react";
import {
  changeUserStatus,
  changeUserRole,
} from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
import { dateFormat } from "../../utils/dateFormat";
import { toast } from "react-toastify";
import PaginationTable from "../ui/PaginationTable";
import EntriesPerPageSelect from "../ui/EntriesPerPageSelect ";
const TableUserPagination = () => {
  const { token, allUsers, totalUsers, page, limit, getAllUserPagination } =
    useEcomStore((state) => state);
  const [pageUser, setPageUser] = useState(1); // เริ่มต้นที่หน้า 1
  const [limitUser, setLimitUser] = useState(10); // จำนวนรายการต่อหน้า

  useEffect(() => {
    getAllUserPagination(token, pageUser, limitUser);
  }, [token, pageUser, limitUser]);
  // การคำนวณจำนวนหน้า
  const totalPages = Math.ceil(totalUsers / limitUser);

  // การเปลี่ยนหน้าหมายเลขหน้า
  const handlePageChange = (event, value) => {
    // value คือหมายเลขหน้าที่เลือก
    setPageUser(value);
  };

  // การเปลี่ยนจำนวนรายการที่แสดงในแต่ละหน้า
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimitUser(newLimit === totalUsers ? totalUsers : newLimit); // ถ้าเลือก All ให้ใช้ totalUsers
    setPageUser(1); // รีเซ็ตไปหน้าแรก
  };

  const handleChangeUserStatus = (token, userId, userStatus) => {
    console.log(token, userId, userStatus);
    const value = {
      id: userId,
      enabled: !userStatus,
    };
    changeUserStatus(token, value)
      .then((res) => {
        // console.log(res)
        getAllUserPagination(token, page, limit);
        toast.success("Update Status Success");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handelChangeUserRole = (token, userId, userRole) => {
    // console.log(token,userId,userRole)
    const value = {
      id: userId,
      role: userRole,
    };
    changeUserRole(token, value)
      .then((res) => {
        // console.log(res)
        getAllUserPagination(token, page, limit);
        toast.success("Update Role Success");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="overflow-x-auto p-6 bg-white shadow-lg ">
      <div className="mb-4">
        <EntriesPerPageSelect
          limit={limitUser}
          total={totalUsers}
          onLimitChange={handleLimitChange}
          totalItems={totalUsers}
        />
      </div>
      <table className="min-w-full  border-collapse bg-white text-sm text-left shadow-md rounded-md">
        <thead className="bg-blue-600 text-white uppercase text-lg font-medium">
          <tr>
            <th className="px-6 py-3 w-40 text-center">ลำดับ</th>
            <th className="px-6 py-3 w-52">Email</th>
            <th className="px-6 py-3 w-50">ชื่อ</th>
            <th className="px-6 py-3 w-56">วันที่สมัคร</th>
            <th className="px-6 py-3 w-56">วันที่แก้ไขล่าสุด</th>
            <th className="px-6 py-3 w-44 text-center">สิทธิ์</th>
            <th className="px-6 py-3 w-44 text-center">สถานะ</th>
            <th className="px-6 py-3 w-44 text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-800">
          {allUsers?.map((item, index) => (
            <tr
              key={item.id}
              className="odd:bg-gray-100 even:bg-white hover:bg-gray-100 transition duration-200"
            >
              <td className="px-6 py-3 w-40 text-center">
                {index + 1 + (page - 1) * limit}
              </td>
              <td className="px-6 py-3 w-52">{item.email}</td>
              <td className="px-6 py-3 w-50">{item.name}</td>
              <td className="px-6 py-3 w-56">{dateFormat(item.createdAt)}</td>
              <td className="px-6 py-3 w-56">{dateFormat(item.updatedAt)}</td>
              <td className="px-6 py-3 w-44 text-center">
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
                className={`px-6 py-3 text-center font-bold w-44 ${
                  item.enabled ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.enabled ? "Active" : "Inactive"}
              </td>
              <td className="px-6 py-3 w-44 text-center">
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
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <PaginationTable
          totalPages={totalPages}
          currentPage={pageUser}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TableUserPagination;
