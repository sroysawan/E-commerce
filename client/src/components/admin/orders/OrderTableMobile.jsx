import React from "react";
import SkeletonLoaderTable from "../../ui/Skeletons/SkeletonLoaderTable";
import { statusColor } from "../../../utils/statusColor";
import { dateFormat } from "../../../utils/dateFormat";
import { numberFormat } from "../../../utils/number";
import useEcomStore from "../../../store/ecom-store";

const OrderTableMobile = ({
  isFirstLoad,
  orders,
  pageOrder,
  limitOrder,
  expandedOrderId,
  handleChangeOrderStatus,
  toggleOrderDetails,
}) => {
  const token = useEcomStore((state) => state.token);
  return (
    <div className="md:hidden">
      {isFirstLoad ? (
        <SkeletonLoaderTable rows={5} columns={8} />
      ) : orders?.length > 0 ? (
        orders.map((item, index) => (
          <div
            key={item.id}
            className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md transition duration-300"
          >
            {/* ชื่อผู้ใช้และสถานะคำสั่งซื้อ */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                {index + 1 + (pageOrder - 1) * limitOrder}.{" "}
                {item.orderedBy.email}
              </span>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor(
                  item.orderStatus
                )}`}
              >
                {item.orderStatus}
              </span>
            </div>

            {/* วันที่ และยอดรวม */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>วันที่: {dateFormat(item.createdAt)}</p>
              <p>ยอดรวม: {numberFormat(item.cartTotal)}</p>
            </div>

            {/* รายการสินค้า */}
            <div className="mt-2">
              <p className="text-sm font-semibold mb-1">สินค้า:</p>
              {item.products.slice(0, 2).map((product, idx) => (
                <p key={idx} className="text-sm text-gray-600 line-clamp-1">
                  - {product.product.title} x {product.count}
                </p>
              ))}
              {item.products.length > 2 && (
                <p className="text-sm text-blue-500 cursor-pointer">
                  + รายการเพิ่มเติม...
                </p>
              )}
            </div>

            {/* ปุ่มจัดการ */}
            <div className="flex justify-between items-center mt-4">
              <select
                value={item.orderStatus}
                onChange={(e) =>
                  handleChangeOrderStatus(token, item.id, e.target.value)
                }
                className="w-36 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Not Process</option>
                <option>Processing</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <button
                onClick={() => toggleOrderDetails(item.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm transition-all duration-300"
              >
                {expandedOrderId === item.id ? "ซ่อนข้อมูล" : "รายละเอียด"}
              </button>
            </div>

            {/* รายละเอียดเพิ่มเติม */}
            {expandedOrderId === item.id && (
              <div className="mt-3 p-3 bg-gray-100 rounded-md shadow-inner">
                <p className="font-semibold mb-2">รายการสินค้า:</p>
                {item.products.map((product, idx) => (
                  <div
                    key={idx}
                    className="mb-2 flex justify-between items-center"
                  >
                    <div className="text-sm text-gray-700">
                      - {product.product.title} x {product.count}
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {numberFormat(product.count * product.product.price)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-4">ไม่พบคำสั่งซื้อ</div>
      )}
    </div>
  );
};

export default OrderTableMobile;
