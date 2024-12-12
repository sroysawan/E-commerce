import React from "react";
import SkeletonLoaderTable from "../../ui/Skeletons/SkeletonLoaderTable";
import { dateFormat } from "../../../utils/dateFormat";

const CategoryTableMobile = ({
  isFirstLoad,
  toggleSortCategory,
  categories,
  pageCategory,
  limitCategory,
  handleUpdateSubmit,
  handleEditClick,
  handleDelete,
  editData,
  handleEditChange,
  handleCancelEdit,
  isEditing,
}) => {
  return (
    <div className="xl:hidden">
      <div className="flex justify-start gap-2 mb-3">
        <button
          onClick={() => toggleSortCategory("createdAt")}
          className="px-2 py-1.5 bg-blue-500 text-xs text-white rounded hover:bg-blue-600"
        >
          Sort by Date
        </button>
        <button
          onClick={() => toggleSortCategory("name")}
          className="px-2 py-1.5 bg-blue-500 text-xs text-white rounded hover:bg-blue-600"
        >
          Sort by Name
        </button>
      </div>
      {isFirstLoad ? (
        <SkeletonLoaderTable rows={5} columns={9} />
      ) : categories?.length > 0 ? (
        categories.map((item,index) => (
          <div
            key={item.id}
            className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md"
          >
            {isEditing && editData.id === item.id ? (
              // โหมดแก้ไข
              <div>
                <input
                  type="text"
                  value={editData.name}
                  onChange={handleEditChange}
                  placeholder="Edit Category Name"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 mb-2"
                />
                <div className="flex justify-end gap-2">
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
              </div>
            ) : (
              // โหมดปกติ
              <>
                <p className="text-sm font-semibold text-gray-700">
                {index + 1 + (pageCategory - 1) * limitCategory}. {item.name}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  Quantity: {item.products.length}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  Created At: {dateFormat(item.createdAt)}
                </p>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium text-sm px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium text-sm px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p className="text-center">ไม่พบหมวดหมู่</p>
      )}
    </div>
  );
};

export default CategoryTableMobile;
