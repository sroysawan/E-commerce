import React, { useEffect, useRef, useState } from "react";
import {
  createCategory,
  removeCategory,
  updateCategory,
} from "../../../api/category";
import useEcomStore from "../../../store/ecom-store";
import { toast } from "react-toastify";
import ConfirmDialog from "../../ui/admin/ConfirmDialog";
import PaginationTable from "../../ui/admin/PaginationTable";
import EntriesPerPageSelect from "../../ui/EntriesPerPageSelect ";
import SearchTable from "../../ui/admin/SearchTable";
import CategoryTableDesktop from "./CategoryTableDesktop";
import CategoryTableMobile from "./CategoryTableMobile";
const FormCategoryPagination = () => {
  const { token, categories, totalCategory, getCategoryPagination, isLoading } =
    useEcomStore((state) => state);

  const [pageCategory, setPageCategory] = useState(1);
  const [limitCategory, setLimitCategory] = useState(10);
  const [name, setName] = useState(""); // สำหรับเพิ่มหมวดหมู่
  const [editData, setEditData] = useState({}); // เก็บข้อมูลที่กำลังแก้ไข
  const [isEditing, setIsEditing] = useState(false); // state สำหรับควบคุมการแก้ไขใน mobile
  // State สำหรับการเปิด/ปิด ConfirmDialog
  const [openDialog, setOpenDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null); // เก็บ ID ของหมวดหมู่ที่ต้องการลบ

  const [sortBy, setSortBy] = useState("createdAt"); // ฟิลด์เริ่มต้น
  const [sortOrder, setSortOrder] = useState("firstToggle"); // ค่าการเรียงลำดับเริ่มต้น

  const [searchQuery, setSearchQuery] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true); // เพิ่มสถานะสำหรับการโหลดครั้งแรก
  const debounceTimeout = useRef(null); // For debouncing search

  useEffect(() => {
    getCategoryPagination(
      token,
      pageCategory,
      limitCategory,
      sortBy,
      sortOrder,
      searchQuery
    );
  }, [token, pageCategory, limitCategory, sortBy, sortOrder, searchQuery]);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setIsFirstLoad(false); // เมื่อโหลดเสร็จครั้งแรก
      }, 200);
    }
  }, [isLoading]);
  // การคำนวณจำนวนหน้า
  const totalPages = Math.ceil(totalCategory / limitCategory);

  // การเปลี่ยนหน้าหมายเลขหน้า
  const handlePageChange = (event, value) => {
    setPageCategory(value);
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
    getCategoryPagination(
      token,
      value,
      limitCategory,
      sortBy,
      sortOrder,
      searchQuery
    );
  };

  // การเปลี่ยนจำนวนรายการที่แสดงในแต่ละหน้า
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimitCategory(newLimit === totalCategory ? totalCategory : newLimit); // ถ้าเลือก All ให้ใช้ totalUsers
    setPageCategory(1); // รีเซ็ตไปหน้าแรก
    getCategoryPagination(token, 1, newLimit, sortOrder);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.warning("Please fill data");
    }

    try {
      const res = await createCategory(token, { name });
      toast.success(`Added category ${res.data.name} successfully!`);
      getCategoryPagination(
        token,
        pageCategory,
        limitCategory,
        sortBy,
        sortOrder,
        searchQuery
      );
      setName(""); // รีเซ็ตช่อง input
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (item) => {
    setEditData({ id: item.id, name: item.name });
    setIsEditing(true); // เปิดโหมดแก้ไข
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, name: e.target.value });
  };

  const handleUpdateSubmit = async (id) => {
    if (!editData.name.trim()) {
      return toast.warning("Please fill data");
    }

    try {
      await updateCategory(token, id, { name: editData.name });
      toast.success(`Updated category to ${editData.name} successfully!`);
      getCategoryPagination(
        token,
        pageCategory,
        limitCategory,
        sortBy,
        sortOrder,
        searchQuery
      );
      setEditData({}); // รีเซ็ตข้อมูลการแก้ไข
      setIsEditing(false); // ปิดโหมดแก้ไขหลังบันทึกสำเร็จ
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelEdit = () => {
    setEditData({});
    setIsEditing(false); // ยกเลิกการแก้ไข
  };

  // ฟังก์ชันเปิด ConfirmDialog เพื่อยืนยันการลบ
  const handleDelete = (id) => {
    // console.log(id);
    setCategoryToDelete(id); // เก็บ ID ของหมวดหมู่ที่ต้องการลบ
    setOpenDialog(true); // เปิด Dialog
  };

  // ฟังก์ชันยืนยันการลบ
  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      try {
        const res = await removeCategory(token, categoryToDelete);
        toast.success(`Deleted category ${res.data.name} successfully!`);
        getCategoryPagination(
          token,
          pageCategory,
          limitCategory,
          sortBy,
          sortOrder,
          searchQuery
        );
        setOpenDialog(false); // ปิด Dialog หลังลบสำเร็จ
        setCategoryToDelete(null); // รีเซ็ต ID ของหมวดหมู่ที่ต้องการลบ
        setTimeout(() => {
          const mainContainer = document.querySelector("main");
          if (mainContainer) {
            mainContainer.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
        }, 100); // หน่วงเวลาเล็กน้อยเพื่อให้แน่ใจว่าการเปลี่ยนหน้าเสร็จสมบูรณ์
      } catch (error) {
        console.log(error);
      }
    }
  };

  // ฟังก์ชันยกเลิกการลบ
  const handleDialogClose = () => {
    setOpenDialog(false); // ปิด Dialog
    setCategoryToDelete(null); // รีเซ็ต ID ของหมวดหมู่ที่ต้องการลบ
  };

  const toggleSortCategory = (field) => {
    if (sortBy === field) {
      // Toggle ระหว่าง asc, desc, และ default
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
    setPageCategory(1); // Reset to first page
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      getCategoryPagination(token, 1, limitCategory, sortBy, sortOrder, value);
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 xl:block xl:overflow-x-auto p-5 bg-white shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-bold text-base md:text-2xl">Category Management</h1>
        <h1 className="font-bold text-xs md:text-xl">
          ทั้งหมด {totalCategory} รายการ
        </h1>
      </div>

      {/* ฟอร์มเพิ่มหมวดหมู่ */}
      <form className="flex gap-1 xl:gap-4 mb-3" onSubmit={handleAddSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add Category"
          className=" border border-gray-300 w-40 md:w-52 text-sm md:text-base rounded-lg px-2 md:px-4 py-1 md:py-2 focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-sm md:text-base text-white font-medium px-2 md:px-4 py-1 md:py-2 rounded-lg transition-transform transform hover:scale-105"
        >
          Add Category
        </button>
      </form>

      <div className="mb-3 flex flex-col space-y-2 xl:space-y-0 xl:flex-row xl:justify-between">
        <EntriesPerPageSelect
          limit={limitCategory}
          total={totalCategory}
          onLimitChange={handleLimitChange}
          totalItems={totalCategory}
        />
        <SearchTable
          handleSearch={handleSearchChange}
          textSearch="Search Category"
        />
      </div>

      {/* Desktop List */}
      <CategoryTableDesktop
        isFirstLoad={isFirstLoad}
        toggleSortCategory={toggleSortCategory}
        categories={categories}
        sortOrder={sortOrder}
        sortBy={sortBy}
        pageCategory={pageCategory}
        limitCategory={limitCategory}
        handleUpdateSubmit={handleUpdateSubmit}
        handleEditClick={handleEditClick}
        handleDelete={handleDelete}
        editData={editData}
        handleEditChange={handleEditChange}
        handleCancelEdit={handleCancelEdit}
      />

      {/* Mobile List */}
      <CategoryTableMobile
        isFirstLoad={isFirstLoad}
        toggleSortCategory={toggleSortCategory}
        categories={categories}
        sortOrder={sortOrder}
        sortBy={sortBy}
        pageCategory={pageCategory}
        limitCategory={limitCategory}
        handleUpdateSubmit={handleUpdateSubmit}
        handleEditClick={handleEditClick}
        handleDelete={handleDelete}
        editData={editData}
        handleEditChange={handleEditChange}
        handleCancelEdit={handleCancelEdit}
        isEditing={isEditing}
      />

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <PaginationTable
          totalPages={totalPages}
          currentPage={pageCategory}
          onPageChange={handlePageChange}
        />
      </div>

      {/* ConfirmDialog สำหรับยืนยันการลบ */}
      <ConfirmDialog
        open={openDialog}
        onConfirm={handleConfirmDelete}
        onCancel={handleDialogClose}
        message="Are you sure you want to delete this category?"
      />
    </div>
  );
};

export default FormCategoryPagination;
