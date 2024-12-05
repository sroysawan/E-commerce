import React from 'react'
import SortTable from '../../ui/SortTable'
import SkeletonLoaderTable from '../../ui/Skeletons/SkeletonLoaderTable'
import useEcomStore from '../../../store/ecom-store'
import { dateFormat } from '../../../utils/dateFormat'
import { numberFormat } from '../../../utils/number'
import { statusColor } from '../../../utils/statusColor'

const OrderTableDesktop = ({
  isFirstLoad,
  toggleSortUser,
  orders,
  sortOrder,
sortBy,
page,
limit,
handleChangeOrderStatus,

 }) => {
  const token = useEcomStore((state)=> state.token)
  return (
    <table className="hidden md:table min-w-full border-collapse bg-white shadow-md">
    <thead className="bg-blue-600 text-white uppercase text-base font-medium">
      <tr>
        <th className="px-4 py-3 w-36 text-center">ลำดับ</th>
        <th className="px-4 py-3 w-56">
          <div className="flex gap-2 items-center justify-start">
            ชื่อผู้ใช้
            <SortTable
              toggleSort={toggleSortUser}
              data={"orderedById"}
              sortOrder={sortOrder}
              sortBy={sortBy}
            />
          </div>
        </th>
        <th className="px-4 py-3 w-56">
          <div className="flex gap-2 items-center justify-start">
            วันที่ทำรายการ
            <SortTable
              toggleSort={toggleSortUser}
              data={"createdAt"}
              sortOrder={sortOrder}
              sortBy={sortBy}
            />
          </div>
        </th>
        <th className="px-4 py-3 w-96 text-left">
          <div className="flex gap-2 items-center justify-start">
            สินค้า
          </div>
        </th>
        <th className="px-4 py-3 w-28">
          <div className="flex gap-2 items-center justify-start">
            รวม
            <SortTable
              toggleSort={toggleSortUser}
              data={"cartTotal"}
              sortOrder={sortOrder}
              sortBy={sortBy}
            />
          </div>
        </th>
        <th className="px-4 py-3 w-40">
          <div className="flex gap-2 items-center justify-center">
            สถานะ
            <SortTable
              toggleSort={toggleSortUser}
              data={"orderStatus"}
              sortOrder={sortOrder}
              sortBy={sortBy}
            />
          </div>
        </th>
        <th className="px-4 py-3 w-40 ">
          <div className="flex gap-2 items-center justify-center">
            การชำระเงิน
            <SortTable
              toggleSort={toggleSortUser}
              data={"status"}
              sortOrder={sortOrder}
              sortBy={sortBy}
            />
          </div>
        </th>
        <th className="px-4 py-3 w-44 text-center">จัดการ</th>
      </tr>
    </thead>
    {/* Body */}
    <tbody className="divide-y divide-gray-200 text-gray-800">
      {isFirstLoad ? (
        <SkeletonLoaderTable rows={5} columns={8} />
      ) : orders?.length > 0 ? (
        orders.map((item, index) => (
          <tr
            key={item.id}
            className="odd:bg-gray-100 even:bg-white hover:bg-gray-100 text-sm transition duration-200"
          >
            <td className="px-4 py-3 text-center">
              {index + 1 + (page - 1) * limit}
            </td>
            <td className="px-4 py-3">
              <p>{item.orderedBy.email}</p>
              <p className="text-sm text-gray-500">
                {item.orderedBy.address}
              </p>
            </td>
            <td className="px-4 py-3">{dateFormat(item.createdAt)}</td>
            <td className="px-4 py-3 text-left">
              {item.products.map((product, idx) => (
                <div key={idx} className="mb-2">
                  <p
                    className="font-medium line-clamp-3"
                    title={product.product.title}
                  >
                    {product.product.title}
                  </p>
                  <span className="text-sm text-gray-600">
                    {`จำนวน ${product.count} x ${numberFormat(
                      product.product.price
                    )}`}
                  </span>
                </div>
              ))}
            </td>
            <td className="px-4 py-3 font-semibold">
              {numberFormat(item.cartTotal)}
            </td>
            <td className="px-4 py-3 text-center">
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full 
                  ${statusColor(item.orderStatus)}`}
              >
                {item.orderStatus}
              </span>
            </td>
            <td className="px-4 py-3 text-center">
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  item.status === "succeeded"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {item.status}
              </span>
            </td>
            <td className="px-4 py-3 text-center">
              <select
                value={item.orderStatus}
                onChange={(e) =>
                  handleChangeOrderStatus(token, item.id, e.target.value)
                }
                className="w-32 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500"
              >
                <option>Not Process</option>
                <option>Processing</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="9" className="text-center py-4">
            ไม่พบคำสั่งซื้อ
          </td>
        </tr>
      )}
    </tbody>
  </table>
  )
}

export default OrderTableDesktop
