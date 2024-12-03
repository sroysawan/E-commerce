import React, { useEffect, useState } from "react";
import { historyUserCart } from "../../api/user";
import useEcomStore from "../../store/ecom-store";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateFormat";
import EntriesPerPageSelect from "../ui/EntriesPerPageSelect ";
import PaginationTable from "../ui/admin/PaginationTable";

const HistoryCart = () => {
  const token = useEcomStore((state) => state.token);
  const [orders, setOrders] = useState([]);
  const [pageOrders, setPageOrders] = useState(1);
  const [limitOrders, setLimitOrders] = useState(5);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    handleGetOrders(token, pageOrders, limitOrders);
  }, [token, pageOrders, limitOrders]);

  const handleGetOrders = (token) => {
    historyUserCart(token, pageOrders, limitOrders)
      .then((res) => {
        // console.log(res.data.orders);
        setOrders(res.data.orders);
        setPageOrders(res.data.page);
        setLimitOrders(res.data.limit);
        setTotalOrders(res.data.total);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // การคำนวณจำนวนหน้า
  const totalPages = Math.ceil(totalOrders / limitOrders);

  const handlePageChange = (event, value) => {
    setPageOrders(value);
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimitOrders(newLimit === totalOrders ? totalOrders : newLimit); // ถ้าเลือก All ให้ใช้ totalUsers
    setPageOrders(1); // รีเซ็ตไปหน้าแรก
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Not Process":
        return "bg-gray-300";
      case "Processing":
        return "bg-blue-300";
      case "Completed":
        return "bg-green-300";
      case "Cancelled":
        return "bg-red-300";
    }
  };
  return (
    <div className="container mx-auto md:px-0 mt-8 mb-8">
      <h1 className="text-lg md:text-2xl font-bold text-left">ประวัติการสั่งซื้อ</h1>
    <div className="bg-white sticky top-0 z-10 rounded-lg shadow-md p-1 md:p-4 my-4">
    <div className="flex flex-row text-xs md:text-base justify-between items-center md:gap-4">
          <EntriesPerPageSelect
            limit={limitOrders}
            total={totalOrders}
            onLimitChange={handleLimitChange}
            totalItems={totalOrders}
          />

          <p className="text-sm text-gray-600 md:text-base">ทั้งหมด {totalOrders} รายการ</p>
        </div>
      </div>

    {/* รายการสั่งซื้อ */}
    <div className="space-y-8 mt-4">
      {orders?.map((order, index) => (
        <div key={order.id} className="bg-gray-200 p-4 rounded-md shadow-md">
          <div className="flex flex-wrap justify-between mb-4">
            <div>
              <p className="text-sm md:text-base font-medium text-gray-600">วันที่สั่งซื้อ</p>
              <p className="text-sm md:text-base font-bold">{dateFormat(order.updatedAt)}</p>
            </div>
            <div>
            <span
                    className={`${getStatusColor(
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
                  <p className="text-sm font-medium text-gray-600">สินค้า</p>
                  <p className="text-sm md:text-base font-bold text-gray-900">{product.product.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">จำนวน</p>
                  <p className="text-sm md:text-base font-bold text-gray-900">{product.count}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">ราคา</p>
                  <p className="text-sm md:text-base font-bold text-gray-900">{numberFormat(product.count * product.price)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <p className="text-sm text-gray-600">ราคาสุทธิ</p>
            <p className="text-lg font-bold text-red-600">{numberFormat(order.cartTotal)}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-4 flex justify-center">
      <PaginationTable totalPages={totalPages} currentPage={pageOrders} onPageChange={handlePageChange} />
    </div>
  </div>
);
};


export default HistoryCart;
