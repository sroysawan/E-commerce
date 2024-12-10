import React, { useEffect, useRef, useState } from "react";
import { historyUserCart } from "../../api/user";
import useEcomStore from "../../store/ecom-store";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateFormat";
import EntriesPerPageSelect from "../ui/EntriesPerPageSelect ";
import PaginationTable from "../ui/admin/PaginationTable";
import { statusColor } from "../../utils/statusColor";
import SearchTable from "../ui/admin/SearchTable";
const HistoryCart = () => {
  const {
    token,
    historyOrders,
    totalHistoryOrders,
    page,
    limit,
    getAllHistoryOrder,
    isLoading,
  } = useEcomStore((state) => state);
  const [orders, setOrders] = useState([]);
  const [pageOrders, setPageOrders] = useState(1);
  const [limitOrders, setLimitOrders] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimeout = useRef(null);
  useEffect(() => {
    getAllHistoryOrder(token, pageOrders, limitOrders, searchQuery);
  }, [token, pageOrders, limitOrders, searchQuery]);

  // การคำนวณจำนวนหน้า
  const totalPages = Math.ceil(totalHistoryOrders / limitOrders);

  const handlePageChange = (event, value) => {
    setPageOrders(value);
    // ใช้ setTimeout เพื่อให้แน่ใจว่าการเปลี่ยนหน้าเสร็จสิ้นก่อนจะเลื่อน
    setTimeout(() => {
      const mainContainer = document.querySelector("main");
      if (mainContainer) {
        mainContainer.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }, 100);
    getAllHistoryOrder(token, value, limitOrders, searchQuery);
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimitOrders(
      newLimit === totalHistoryOrders ? totalHistoryOrders : newLimit
    ); // ถ้าเลือก All ให้ใช้ totalUsers
    setPageOrders(1); // รีเซ็ตไปหน้าแรก
    getAllHistoryOrder(token, 1, newLimit);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setPageOrders(1); // Reset to first page
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      getAllHistoryOrder(token, 1, limitOrders, value);
    }, 500);
  };

  return (
    <div className="container mx-auto px-2 sm:px-2 md:px-0 lg:px-2 xl:px-0 mt-4 xl:mt-8">
      <div className="flex justify-between items-center">
        <h1 className="text-lg md:text-2xl font-bold text-left">
          ประวัติการสั่งซื้อ
        </h1>
        <div className="md:hidden ">
        <SearchTable
          handleSearch={handleSearchChange}
          textSearch="Search Order Cart"
        />
      </div>
      </div>
      <div className="bg-white sticky top-0 z-10 rounded-lg shadow-md p-1 md:p-4 my-4">
        <div className="flex flex-row text-xs md:text-base justify-between items-center md:gap-4">
          <EntriesPerPageSelect
            limit={limitOrders}
            total={totalHistoryOrders}
            onLimitChange={handleLimitChange}
            // totalItems={totalHistoryOrders}
          />
          <div className="hidden md:block">
            <SearchTable
              handleSearch={handleSearchChange}
              textSearch="Search Order Cart"
            />
          </div>

          <div className="flex items-center text-sm text-gray-600 md:text-base">
            <p>ทั้งหมด</p>
            <span className="px-2 w-8 text-center">{totalHistoryOrders}</span>
            <p>รายการ</p>
          </div>
        </div>
      </div>

      {/* รายการสั่งซื้อ */}
      <div className="space-y-8 mt-4">
        {historyOrders.length === 0 ? (
          <p className="text-center text-gray-600 py-4">ไม่พบคำสั่งซื้อ</p>
        ) : (
          historyOrders?.map((order, index) => (
            <div
              key={order.id}
              className="bg-gray-200 p-4 rounded-md shadow-md"
            >
              <div className="flex flex-wrap justify-between mb-4">
                <div>
                  <p className="text-sm md:text-base font-medium text-gray-600">
                    วันที่สั่งซื้อ
                  </p>
                  <p className="text-sm md:text-base font-bold">
                    {dateFormat(order.updatedAt)}
                  </p>
                </div>
                <div>
                  <span
                    className={`${statusColor(
                      order.orderStatus
                    )} px-2 py-1 rounded-full text-xs md:text-base`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
              {/* แสดงรายการสินค้าแบบ Card */}
              <div className="space-y-4">
                {order.products.map((product, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow-sm"
                  >
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-gray-600">
                        สินค้า
                      </p>
                      <p className="text-sm md:text-base font-bold text-gray-900">
                        {product.product.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">จำนวน</p>
                      <p className="text-sm md:text-base font-bold text-gray-900">
                        {product.count}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">ราคา</p>
                      <p className="text-sm md:text-base font-bold text-gray-900">
                        {numberFormat(product.count * product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <p className="text-sm text-gray-600">ราคาสุทธิ</p>
                <p className="text-lg font-bold text-red-600">
                  {numberFormat(order.cartTotal)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <PaginationTable
          totalPages={totalPages}
          currentPage={pageOrders}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default HistoryCart;
