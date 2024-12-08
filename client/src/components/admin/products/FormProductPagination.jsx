import React, { useEffect, useRef, useState } from "react";
import useEcomStore from "../../../store/ecom-store";
import { deleteProduct } from "../../../api/product";
import { toast } from "react-toastify";
import ConfirmDialog from "../../ui/ConfirmDialog";
import PaginationTable from "../../ui/admin/PaginationTable";
import EntriesPerPageSelect from "../../ui/EntriesPerPageSelect ";
import SearchTable from "../../ui/admin/SearchTable";
import ProductTableDesktop from "./ProductTableDesktop";
import ProductTableMobile from "./ProductTableMobile";

const initialState = {
  title: "",
  description: "",
  price: "",
  quantity: "",
  categoryId: "",
  images: [],
};
const FormProductPagination = () => {
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);

  const {
    products,
    totalProduct,
    getProductPagination,
    isLoading,
  } = useEcomStore((state) => state);

  // State สำหรับการเปิด/ปิด ConfirmDialog
  const [openDialog, setOpenDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); // เก็บ ID ของหมวดหมู่ที่ต้องการลบ

  const [sortBy, setSortBy] = useState("createdAt"); // ฟิลด์เริ่มต้น
  const [sortOrder, setSortOrder] = useState("firstToggle"); // ค่าการเรียงลำดับเริ่มต้น

  const [searchQuery, setSearchQuery] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true); // เพิ่มสถานะสำหรับการโหลดครั้งแรก
  const debounceTimeout = useRef(null); // For debouncing search

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    images: [],
  });

  const [pageProduct, setPageProduct] = useState(1);
  const [limitProduct, setLimitProduct] = useState(10);
  // console.log(products);

  useEffect(() => {
    getCategory();
    // getProduct(100);
  }, []);

  useEffect(() => {
    getProductPagination(
      token,
      pageProduct,
      limitProduct,
      sortBy,
      sortOrder,
      searchQuery
    );
  }, [token, pageProduct, limitProduct, sortBy, sortOrder, searchQuery]);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setIsFirstLoad(false); // เมื่อโหลดเสร็จครั้งแรก
      }, 200);
    }
  }, [isLoading]);
  // การคำนวณจำนวนหน้า
  const totalPages = Math.ceil(totalProduct / limitProduct);

  // การเปลี่ยนหน้าหมายเลขหน้า
  const handlePageChange = (event, value) => {
    setPageProduct(value);

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
    // getProductPagination(token, value, limitProduct, sortOrder);
    getProductPagination(
      token,
      value,
      limitProduct,
      sortBy,
      sortOrder,
      searchQuery
    );
  };

  // การเปลี่ยนจำนวนรายการที่แสดงในแต่ละหน้า
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimitProduct(newLimit === totalProduct ? totalProduct : newLimit); // ถ้าเลือก All ให้ใช้ totalUsers
    setPageProduct(1); // รีเซ็ตไปหน้าแรก
    getProductPagination(token, 1, newLimit, sortOrder);
  };

  // ฟังก์ชันเปิด ConfirmDialog เพื่อยืนยันการลบ
  const handleDelete = (id) => {
    // console.log(id);
    setProductToDelete(id); // เก็บ ID ของหมวดหมู่ที่ต้องการลบ
    setOpenDialog(true); // เปิด Dialog
  };

  // ฟังก์ชันยืนยันการลบ
  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        const res = await deleteProduct(token, productToDelete);
        toast.success(`Deleted Product ${res.data.name} successfully!`);
        getProductPagination(token, pageProduct, limitProduct);
        setOpenDialog(false); // ปิด Dialog หลังลบสำเร็จ
        setProductToDelete(null); // รีเซ็ต ID ของหมวดหมู่ที่ต้องการลบ
      } catch (error) {
        console.log(error);
      }
    }
  };

  // ฟังก์ชันยกเลิกการลบ
  const handleDialogClose = () => {
    setOpenDialog(false); // ปิด Dialog
    setProductToDelete(null); // รีเซ็ต ID ของหมวดหมู่ที่ต้องการลบ
  };

  const toggleSortProduct = (field) => {
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
    // setPageProduct(1); // รีเซ็ตไปหน้าแรก
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setPageProduct(1); // Reset to first page
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      getProductPagination(token, 1, limitProduct, sortBy, sortOrder, value);
    }, 500);
  };

  return (
    <div className="gird grid-cols-1 xl:block p-5 bg-white shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-bold text-sm xl:text-2xl">Product</h1>
        <h1 className="font-bold text-xs xl:text-xl">
          ทั้งหมด {totalProduct} รายการ
        </h1>
      </div>

      <div className="mb-3 flex flex-col space-y-2 xl:space-y-0 xl:flex-row xl:justify-between">
        <EntriesPerPageSelect
          limit={limitProduct}
          total={totalProduct}
          onLimitChange={handleLimitChange}
          totalItems={totalProduct}
        />
        <SearchTable
          handleSearch={handleSearchChange}
          textSearch="Search Products"
        />
      </div>
      <ProductTableDesktop
        isFirstLoad={isFirstLoad}
        toggleSortProduct={toggleSortProduct}
        products={products}
        sortOrder={sortOrder}
        sortBy={sortBy}
        pageProduct={pageProduct}
        limitProduct={limitProduct}
        handleDelete={handleDelete}
      />

      <ProductTableMobile
        isFirstLoad={isFirstLoad}
        toggleSortProduct={toggleSortProduct}
        products={products}
        sortOrder={sortOrder}
        sortBy={sortBy}
        pageProduct={pageProduct}
        limitProduct={limitProduct}
        handleDelete={handleDelete}
      />


      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <PaginationTable
          totalPages={totalPages}
          currentPage={pageProduct}
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

export default FormProductPagination;
