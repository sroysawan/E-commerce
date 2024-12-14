import React from 'react'
import { numberFormat } from '../../../utils/number'
import { dateFormat } from '../../../utils/dateFormat'
import SkeletonLoaderTable from '../../ui/Skeletons/SkeletonLoaderTable'
import SortTable from '../../ui/SortTable'
import { Link } from 'react-router-dom'
import { Pencil, Trash } from 'lucide-react'

const ProductTableDesktop = ({
    isFirstLoad,
    toggleSortProduct,
    products,
    sortOrder,
    sortBy,
    pageProduct,
    limitProduct,
    handleDelete,
}) => {
  return (
    <table className="hidden xl:table min-w-full border-collapse bg-white shadow-md">
    <thead className="bg-blue-500 text-white text-left text-base uppercase font-medium">
      <tr>
        <th className="px-4 py-3 w-10 text-center">No</th>
        <th className="px-4 py-3 w-36 text-center">รูปภาพ</th>
        <th className="px-4 py-3 w-44">
          <div className="flex gap-2 items-center justify-start">
            ชื่อ
            <SortTable
              toggleSort={toggleSortProduct}
              data={"title"}
              sortOrder={sortOrder}
              sortBy={sortBy}
            />
          </div>
        </th>
        <th className="px-4 py-3 w-52">
          <div className="flex gap-2 items-center justify-start">
            รายละเอียด
            <SortTable
              toggleSort={toggleSortProduct}
              data={"description"}
              sortOrder={sortOrder}
              sortBy={sortBy}
            />
          </div>
        </th>
        <th className="px-4 py-3 w-32">
          <div className="flex gap-2 items-center justify-start">
            หมวดหมู่
            <SortTable
              toggleSort={toggleSortProduct}
              data={"categoryId"}
              sortOrder={sortOrder}
              sortBy={sortBy}
            />
          </div>
        </th>
        <th className="px-4 py-3 w-20">
          <div className="flex gap-2 items-center justify-start">
            ราคา
            <SortTable
              toggleSort={toggleSortProduct}
              data={"price"}
              sortOrder={sortOrder}
              sortBy={sortBy}
            />
          </div>
        </th>
        <th className="px-4 py-3 w-20">
          <div className="flex gap-2 items-center justify-center">
            จำนวน
            <SortTable
              toggleSort={toggleSortProduct}
              data={"quantity"}
              sortOrder={sortOrder}
              sortBy={sortBy}
            />
          </div>
        </th>
        <th className="px-4 py-3 w-40">
          <div className="flex gap-2 items-center justify-center">
            จำนวนที่ขายได้
            <SortTable
              toggleSort={toggleSortProduct}
              data={"sold"}
              sortOrder={sortOrder}
              sortBy={sortBy}
            />
          </div>
        </th>
        <th className="px-4 py-3 w-40">
          <div className="flex gap-2 items-center justify-start">
            วันที่สร้าง
            <SortTable
              toggleSort={toggleSortProduct}
              data={"createdAt"}
              sortOrder={sortOrder}
              sortBy={sortBy}
            />
          </div>
        </th>
        <th className="px-4 py-3 w-40">
          <div className="flex gap-2 items-center justify-start">
            วันที่อัปเดต
            <SortTable
              toggleSort={toggleSortProduct}
              data={"updatedAt"}
              sortOrder={sortOrder}
              sortBy={sortBy}
            />
          </div>
        </th>
        <th className="px-4 py-3 w-24 text-center">จัดการ</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 text-gray-800">
      {isFirstLoad ? (
        <SkeletonLoaderTable rows={5} columns={11} />
      ) : products?.length > 0 ? (
        products.map((item, index) => (
          <tr
            key={item.id}
            className="odd:bg-gray-100 even:bg-white hover:bg-gray-100 text-sm transition-colors"
          >
            <td className="px-4 py-4 text-center">
              {index + 1 + (pageProduct - 1) * limitProduct}
            </td>
            <td className="px-4 py-4">
              {item.images.length > 0 ? (
                <img
                  src={item.images[0].url}
                  className="w-full h-24 object-contain rounded-lg border bg-white"
                  alt={`Product ${item.title || "No title"}`}
                />
              ) : (
                <div className="w-full h-24 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                  No image
                </div>
              )}
            </td>
            <td className="px-4 py-4">
              <p
                className="leading-relaxed line-clamp-3 min-h-[3rem]"
                title={item.title}
              >
                {item.title}
              </p>
            </td>
            <td className="px-4 py-4">
              <p
                className="line-clamp-3 leading-relaxed min-h-[3rem]"
                title={item.description}
              >
                {item.description}
              </p>
            </td>

            <td className="px-4 py-4 uppercase">{item.category?.name}</td>
            <td className="px-4 py-4">{numberFormat(item.price)}</td>
            <td className="px-4 py-4 text-center">{item.quantity}</td>
            <td className="px-4 py-4 text-center">{item.sold}</td>
            <td className="px-4 py-4">{dateFormat(item.createdAt)}</td>
            <td className="px-4 py-4">{dateFormat(item.updatedAt)}</td>
            <td className="px-4 py-4 text-center">
              <div className="flex justify-center items-center gap-2">
                <Link
                  to={`/admin/product/${item.id}`}
                  className="bg-yellow-500 text-white rounded-md px-2 py-2 hover:bg-yellow-600"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white rounded-md px-2 py-2 hover:bg-red-600"
                >
                  <Trash size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="11" className="text-center py-4">
            ไม่พบสินค้า
          </td>
        </tr>
      )}
    </tbody>
  </table>
  )
}

export default ProductTableDesktop
