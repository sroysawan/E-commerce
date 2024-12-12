import { Pencil, Trash2 } from 'lucide-react'
import React from 'react'
import SortTable from '../../ui/SortTable'
import SkeletonLoaderTable from '../../ui/Skeletons/SkeletonLoaderTable'
import { dateFormat } from '../../../utils/dateFormat'

const CategoryTableDesktop = ({
    isFirstLoad,
    toggleSortCategory,
    categories,
    sortOrder,
    sortBy,
    pageCategory,
    limitCategory,
    handleUpdateSubmit,
    handleEditClick,
    handleDelete,
    editData,
    handleEditChange,
    handleCancelEdit 
}) => {
  return (
    <table className="hidden xl:table min-w-full divide-y divide-gray-200 bg-white shadow-md">
    <thead className="bg-blue-600 text-white uppercase text-base font-medium">
      <tr>
        <th className="px-4 py-3 w-60 text-center">ลำดับ</th>
        <th className="px-12 py-3 w-80 text-left">
          <div className="flex gap-2 items-center justify-start">
            หมวดหมู่
            <SortTable
              toggleSort={toggleSortCategory}
              data={"name"}
              sortOrder={sortOrder}
              sortBy={sortBy}
            />
          </div>
        </th>
        <th className="px-4 py-3 w-80 text-center">
          <div className="flex gap-2 items-center justify-center">
            จำนวนรายการ
          </div>
        </th>
        <th className="px-6 py-3 w-60">
          <div className="flex gap-2 items-center justify-start">
            วันที่สมัคร
            <SortTable
              toggleSort={toggleSortCategory}
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
      {isFirstLoad ? (
        <SkeletonLoaderTable rows={5} columns={5} />
      ) : categories?.length > 0 ? (
        categories.map((item, index) => (
          <tr
            key={item.id}
            className="odd:bg-gray-100 even:bg-white hover:bg-gray-100 text-sm transition-colors"
          >
            <td className="px-4 py-2 text-center">
              {index + 1 + (pageCategory - 1) * limitCategory}
            </td>
            <td className="px-12 py-2">
              {editData.id === item.id ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="w-full border uppercase border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p className="uppercase">{item.name}</p>
              )}
            </td>
            <td className="px-4 py-2 text-center">
              {item.products.length}
            </td>
            <td className="px-6 py-3 w-56">{dateFormat(item.createdAt)}</td>
            <td className="px-4 py-2 text-center">
              {editData.id === item.id ? (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleUpdateSubmit(item.id)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
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
  )
}

export default CategoryTableDesktop
