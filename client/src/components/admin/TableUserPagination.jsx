import React, { useEffect, useRef, useState } from "react";
import { changeUserStatus, changeUserRole } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
import { dateFormat } from "../../utils/dateFormat";
import { toast } from "react-toastify";
import PaginationTable from "../ui/PaginationTable";
import EntriesPerPageSelect from "../ui/EntriesPerPageSelect ";
import SortTable from "../ui/SortTable";
import SearchTable from "../ui/admin/SearchTable";
const TableUserPagination = () => {
  const { token, allUsers, totalUsers, page, limit, getAllUserPagination } =
    useEcomStore((state) => state);
  const [pageUser, setPageUser] = useState(1); // เริ่มต้นที่หน้า 1
  const [limitUser, setLimitUser] = useState(10); // จำนวนรายการต่อหน้า
  const [sortBy, setSortBy] = useState("createdAt"); // ฟิลด์เริ่มต้น
  const [sortOrder, setSortOrder] = useState("default"); // ค่าการเรียงลำดับเริ่มต้น

  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimeout = useRef(null); // For debouncing search

  useEffect(() => {
    getAllUserPagination(
      token,
      pageUser,
      limitUser,
      sortBy,
      sortOrder,
      searchQuery
    );
  }, [token, pageUser, limitUser, sortBy, sortOrder, searchQuery]);

  // การคำนวณจำนวนหน้า
  const totalPages = Math.ceil(totalUsers / limitUser);

  // การเปลี่ยนหน้าหมายเลขหน้า
  const handlePageChange = (event, value) => {
    // value คือหมายเลขหน้าที่เลือก
    setPageUser(value);
    getAllUserPagination(token, pageUser, limitUser, sortUser);
  };

  // การเปลี่ยนจำนวนรายการที่แสดงในแต่ละหน้า
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimitUser(newLimit === totalUsers ? totalUsers : newLimit); // ถ้าเลือก All ให้ใช้ totalUsers
    setPageUser(1); // รีเซ็ตไปหน้าแรก
    getAllUserPagination(token, 1, newLimit, sortOrder);
  };

  const handleChangeUserStatus = (token, userId, userStatus) => {
    const value = {
      id: userId,
      enabled: !userStatus,
    };

    changeUserStatus(token, value)
      .then((res) => {
        toast.success("Update Status Success");
        getAllUserPagination(
          token,
          pageUser,
          limitUser,
          sortBy,
          sortOrder,
          searchQuery
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handelChangeUserRole = (token, userId, userRole) => {
    const value = {
      id: userId,
      role: userRole,
    };
    changeUserRole(token, value)
      .then((res) => {
        toast.success("Update Role Success");
        getAllUserPagination(
          token,
          pageUser,
          limitUser,
          sortBy,
          sortOrder,
          searchQuery
        );

      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleSortUser = (field) => {
    if (sortBy === field) {
      // Toggle ระหว่าง asc, desc, และ default
      const newSortOrder =
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "default" : "asc";
      setSortOrder(newSortOrder);
    } else {
      setSortBy(field); // เปลี่ยนฟิลด์
      setSortOrder("asc"); // Reset เป็น asc เสมอเมื่อเปลี่ยนฟิลด์
    }
    // setPageUser(1); // รีเซ็ตไปหน้าแรก
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setPageUser(1); // Reset to first page
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      getAllUserPagination(token, 1, limitUser, sortBy, sortOrder, value);
    }, 500);
  };

  return (
    <div className="overflow-x-auto p-5 bg-white shadow-lg ">
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-bold text-2xl">User Management</h1>
        <h1 className="font-bold text-xl">ทั้งหมด {totalUsers} รายการ</h1>
        {/* <SearchTable handleSearch={handleSearchChange} /> */}
      </div>
      <div className="mb-3 flex justify-between">
        <EntriesPerPageSelect
          limit={limitUser}
          total={totalUsers}
          onLimitChange={handleLimitChange}
          totalItems={totalUsers}
        />
        <SearchTable handleSearch={handleSearchChange} />
      </div>
      <table className="min-w-full  border-collapse bg-white text-sm text-left shadow-md rounded-md">
        <thead className="bg-blue-600 text-white uppercase text-base font-medium">
          <tr>
            <th className="px-6 py-3 w-40 text-center">ลำดับ</th>
            <th className="px-6 py-3 w-52">
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
            <th className="px-6 py-3 w-50 ">
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
            <th className="px-6 py-3 w-44">
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
          {allUsers?.length > 0 ? (
            allUsers?.map((item, index) => (
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
                <td className="px-6 py-3 w-40 text-center">
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
