import React, { useEffect, useRef, useState } from "react";
import useEcomStore from "../../../store/ecom-store";
import { changeOrderStatus } from "../../../api/admin";
import { toast } from "react-toastify";
import PaginationTable from "../../ui/admin/PaginationTable";
import EntriesPerPageSelect from "../../ui/EntriesPerPageSelect ";
import SearchTable from "../../ui/admin/SearchTable";
import OrderTableDesktop from "./OrderTableDesktop";
import OrderTableMobile from "./OrderTableMobile";
const TableOrderPagination = () => {
  const { token, orders, totalOrders, getOrderPagination, isLoading } =
    useEcomStore((state) => state);

  const [pageOrder, setPageOrder] = useState(1);
  const [limitOrder, setLimitOrder] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt"); // ฟิลด์เริ่มต้น
  const [sortOrder, setSortOrder] = useState("firstToggle"); // ค่าการเรียงลำดับเริ่มต้น
  const [searchQuery, setSearchQuery] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true); // เพิ่มสถานะสำหรับการโหลดครั้งแรก
  const debounceTimeout = useRef(null); // For debouncing search
  // console.log(orders);
  useEffect(() => {
    getOrderPagination(
      token,
      pageOrder,
      limitOrder,
      sortBy,
      sortOrder,
      searchQuery
    );
  }, [token, pageOrder, limitOrder, sortBy, sortOrder, searchQuery]);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setIsFirstLoad(false); // เมื่อโหลดเสร็จครั้งแรก
      }, 200);
    }
  }, [isLoading]);
  // การคำนวณจำนวนหน้า
  const totalPages = Math.ceil(totalOrders / limitOrder);

  // การเปลี่ยนหน้าหมายเลขหน้า
  const handlePageChange = (event, value) => {
    setPageOrder(value);
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

    // getOrderPagination(token, pageOrder, limitOrder, sortOrder);
    getOrderPagination(
      token,
      value,
      limitOrder,
      sortBy,
      sortOrder,
      searchQuery
    );
  };

  // การเปลี่ยนจำนวนรายการที่แสดงในแต่ละหน้า
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimitOrder(newLimit === totalOrders ? totalOrders : newLimit); // ถ้าเลือก All ให้ใช้ totalUsers
    setPageOrder(1); // รีเซ็ตไปหน้าแรก
    getOrderPagination(token, 1, newLimit, sortOrder);
  };

  const handleChangeOrderStatus = (token, orderId, orderStatus) => {
    // console.log(orderId, orderStatus)
    changeOrderStatus(token, orderId, orderStatus)
      .then((res) => {
        // console.log(res);
        toast.success("Updated Status Order Completed");
        getOrderPagination(
          token,
          pageOrder,
          limitOrder,
          sortBy,
          sortOrder,
          searchQuery
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleSortOrder = (field) => {
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
    setPageOrder(1); // Reset to first page
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      getOrderPagination(token, 1, limitOrder, sortBy, sortOrder, value);
    }, 500);
  };

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  return (
    <div className="grid grid-cols-1 xl:block overflow-x-auto p-5 bg-gray-50 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-bold text-base xl:text-2xl">Order Management</h1>
        <h1 className="font-bold text-xs xl:text-xl">
          ทั้งหมด {totalOrders} รายการ
        </h1>
      </div>
      <div className="mb-3 flex flex-col space-y-2 xl:space-y-0 xl:flex-row xl:justify-between">
        <EntriesPerPageSelect
          limit={limitOrder}
          total={totalOrders}
          onLimitChange={handleLimitChange}
          totalItems={totalOrders}
        />
        {/* email address titleproduct  */}
        <SearchTable
          handleSearch={handleSearchChange}
          textSearch="Search Orders"
        />
      </div>

      <OrderTableDesktop
        isFirstLoad={isFirstLoad}
        toggleSortOrder={toggleSortOrder}
        orders={orders}
        sortOrder={sortOrder}
        sortBy={sortBy}
        pageOrder={pageOrder}
        limitOrder={limitOrder}
        handleChangeOrderStatus={handleChangeOrderStatus}
      />

      <OrderTableMobile
        isFirstLoad={isFirstLoad}
        orders={orders}
        pageOrder={pageOrder}
        limitOrder={limitOrder}
        expandedOrderId={expandedOrderId}
        handleChangeOrderStatus={handleChangeOrderStatus}
        toggleOrderDetails={toggleOrderDetails}
        toggleSortOrder={toggleSortOrder}
      />

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <PaginationTable
          totalPages={totalPages}
          currentPage={pageOrder}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TableOrderPagination;
