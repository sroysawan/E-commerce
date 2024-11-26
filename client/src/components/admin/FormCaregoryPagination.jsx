import React, { useEffect, useRef, useState } from "react";
import {
  createCategory,
  removeCategory,
  updateCategory,
} from "../../api/category";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmDialog from "../ui/ConfirmDialog";
import PaginationTable from "../ui/PaginationTable";
import EntriesPerPageSelect from "../ui/EntriesPerPageSelect ";
import SearchTable from "../ui/admin/SearchTable";
import { dateFormat } from "../../utils/dateFormat";
import SortTable from "../ui/SortTable";
const FormCategoryPagination = () => {
  const {
    token,
    categories,
    totalCategory,
    page,
    limit,
    getCategoryPagination,
  } = useEcomStore((state) => state);

  const [pageCategory, setPageCategory] = useState(1);
  const [limitCategory, setLimitCategory] = useState(10);
  const [name, setName] = useState(""); // สำหรับเพิ่มหมวดหมู่
  const [editData, setEditData] = useState({}); // เก็บข้อมูลที่กำลังแก้ไข

  // State สำหรับการเปิด/ปิด ConfirmDialog
  const [openDialog, setOpenDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null); // เก็บ ID ของหมวดหมู่ที่ต้องการลบ

  const [sortBy, setSortBy] = useState("createdAt"); // ฟิลด์เริ่มต้น
  const [sortOrder, setSortOrder] = useState("default"); // ค่าการเรียงลำดับเริ่มต้น

  const [searchQuery, setSearchQuery] = useState("");
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

  // การคำนวณจำนวนหน้า
  const totalPages = Math.ceil(totalCategory / limitCategory);

  // การเปลี่ยนหน้าหมายเลขหน้า
  const handlePageChange = (event, value) => {
    setPageCategory(value);
    getCategoryPagination(
      token,
      pageCategory,
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
    } catch (error) {
      console.log(error);
    }
  };

  // ฟังก์ชันเปิด ConfirmDialog เพื่อยืนยันการลบ
  const handleDelete = (id) => {
    console.log(id);
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
      getCategoryPagination(
        token,
        pageCategory,
        limitCategory,
        sortBy,
        sortOrder,
        value
      );
    }, 500);
  };

  return (
    <div className="p-6 bg-white shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Category Management
        </h1>
        <h1 className="font-bold text-xl">ทั้งหมด {totalCategory} รายการ</h1>
      </div>

      {/* ฟอร์มเพิ่มหมวดหมู่ */}
      <form className="flex gap-4" onSubmit={handleAddSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add Category"
          className=" border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
        >
          Add Category
        </button>
      </form>
      <br />
      <hr />
      <br />

      <div className="mb-3 flex justify-between">
        <EntriesPerPageSelect
          limit={limitCategory}
          total={totalCategory}
          onLimitChange={handleLimitChange}
          totalItems={totalCategory}
        />
        <SearchTable handleSearch={handleSearchChange} />
      </div>

      {/* ตารางหมวดหมู่ */}
      <table className="w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
        <thead className="bg-blue-600 text-white uppercase text-lg font-medium">
          <tr>
            <th className="px-4 py-3 w-60 text-center">ลำดับ</th>
            <th className="px-12 py-3 w-80 text-left">
              <div className="flex gap-2 items-center justify-start">
                หมวดหมู่
                <SortTable
                  toggleSort={toggleSortUser}
                  data={"name"}
                  sortOrder={sortOrder}
                  sortBy={sortBy}
                />
              </div>
            </th>
            <th className="px-4 py-3 w-80 text-center">
              <div className="flex gap-2 items-center justify-center">
                จำนวนรายการ
                {/* <SortTable
                  toggleSort={toggleSortUser}
                  data={"createdAt"}
                  sortOrder={sortOrder}
                  sortBy={sortBy}
                /> */}
              </div>
            </th>
            <th className="px-4 py-3 w-60">
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
            <th className="px-4 py-3 w-80 text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-800">
        {categories?.length > 0 ? (
          categories.map((item, index) => (
            <tr
              key={item.id}
              className="odd:bg-gray-100 even:bg-white hover:bg-gray-100 transition-colors"
            >
              <td className="px-4 py-2 text-center">
                {index + 1 + (page - 1) * limit}
              </td>
              <td className="px-12 py-2">
                {editData.id === item.id ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <p>{item.name}</p>
                )}
              </td>
              <td className="px-4 py-2 text-center">{item.products.length}</td>
              <td className="px-6 py-3 w-56">{dateFormat(item.createdAt)}</td>
              <td className="px-4 py-2 text-center">
                {editData.id === item.id ? (
                  <button
                    onClick={() => handleUpdateSubmit(item.id)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                  >
                    Save
                  </button>
                ) : (
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center py-4">
              ไม่พบหมวดหมู่
            </td>
          </tr>
        )}
        </tbody>
      </table>
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
