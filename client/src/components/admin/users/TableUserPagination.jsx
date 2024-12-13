import React, { useEffect, useRef, useState } from "react";
import { changeUserStatus, changeUserRole } from "../../../api/admin";
import useEcomStore from "../../../store/ecom-store";
import { toast } from "react-toastify";
import PaginationTable from "../../ui/admin/PaginationTable";
import EntriesPerPageSelect from "../../ui/EntriesPerPageSelect ";
import SearchTable from "../../ui/admin/SearchTable";
import UserTableDesktop from "./UserTableDesktop";
import UserTableMobile from "./UserTableMobile";
const TableUserPagination = () => {
  const {
    token,
    allUsers,
    totalUsers,
    getAllUserPagination,
    isLoading,
  } = useEcomStore((state) => state);
  const [pageUser, setPageUser] = useState(1); // เริ่มต้นที่หน้า 1
  const [limitUser, setLimitUser] = useState(10); // จำนวนรายการต่อหน้า
  const [sortBy, setSortBy] = useState("createdAt"); // ฟิลด์เริ่มต้น
  const [sortOrder, setSortOrder] = useState("firstToggle"); // ค่าการเรียงลำดับเริ่มต้น

  const [searchQuery, setSearchQuery] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true); // เพิ่มสถานะสำหรับการโหลดครั้งแรก
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

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setIsFirstLoad(false); // เมื่อโหลดเสร็จครั้งแรก
      }, 200);
    }
  }, [isLoading]);

  // การคำนวณจำนวนหน้า
  const totalPages = Math.ceil(totalUsers / limitUser);

  // การเปลี่ยนหน้าหมายเลขหน้า
  const handlePageChange = (event, value) => {
    // value คือหมายเลขหน้าที่เลือก
    setPageUser(value);
    // เลื่อนผ่าน main container
    // ใช้ setTimeout เพื่อให้แน่ใจว่าการเปลี่ยนหน้าเสร็จสิ้นก่อนจะเลื่อน
    setTimeout(() => {
      const mainContainer = document.querySelector("main");
      if (mainContainer) {
        mainContainer.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }, 100); // หน่วงเวลาเล็กน้อยเพื่อให้แน่ใจว่าการเปลี่ยนหน้าเสร็จสมบูรณ์
    // getAllUserPagination(token, pageUser, limitUser, sortOrder);
    getAllUserPagination(
      token,
      value,
      limitUser,
      sortBy,
      sortOrder,
      searchQuery
    );
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
      // Toggle ระหว่าง asc, desc, และ firstToggle
      const newSortOrder =
        sortOrder === "asc"
          ? "desc"
          : sortOrder === "desc"
          ? "firstToggle"
          : "asc";
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
    <div className="grid grid-cols-1 xl:block overflow-x-auto p-5 bg-white shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-bold text-base xl:text-2xl">User Management</h1>
        <h1 className="font-bold text-xs xl:text-xl">
          ทั้งหมด {totalUsers} รายการ
        </h1>
      </div>
      {/* flex flex-row text-xs xl:text-base justify-between items-center xl:gap-4" */}
      <div className="mb-3 flex flex-col space-y-2 xl:space-y-0 xl:flex-row xl:justify-between">
        <EntriesPerPageSelect
          limit={limitUser}
          total={totalUsers}
          onLimitChange={handleLimitChange}
          totalItems={totalUsers}
        />
        <SearchTable
          handleSearch={handleSearchChange}
          textSearch="Search Users"
        />
      </div>

      <UserTableDesktop
        isFirstLoad={isFirstLoad}
        toggleSortUser={toggleSortUser}
        allUsers={allUsers}
        sortOrder={sortOrder}
        sortBy={sortBy}
        pageUser={pageUser}
        limitUser={limitUser}
        handelChangeUserRole={handelChangeUserRole}
        handleChangeUserStatus={handleChangeUserStatus}
      />

      <UserTableMobile
        isFirstLoad={isFirstLoad}
        toggleSortUser={toggleSortUser}
        allUsers={allUsers}
        sortOrder={sortOrder}
        sortBy={sortBy}
        pageUser={pageUser}
        limitUser={limitUser}
        handelChangeUserRole={handelChangeUserRole}
        handleChangeUserStatus={handleChangeUserStatus}
      />

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
