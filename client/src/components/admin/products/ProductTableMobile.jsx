import { Pencil, Trash } from "lucide-react";
import React from "react";
import { numberFormat } from "../../../utils/number";
import SkeletonLoaderTable from "../../ui/Skeletons/SkeletonLoaderTable";
import { Link } from "react-router-dom";

const ProductTableMobile = ({
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
    <div className="block xl:hidden space-y-4">
      <div className="flex justify-between gap-2 mb-3">
        <button
          onClick={() => toggleSortUser("createdAt")}
          className="px-2 py-1 bg-blue-500 text-xs text-white rounded hover:bg-blue-600"
        >
          Sort by Date
        </button>
        <button
          onClick={() => toggleSortUser("title")}
          className="px-2 py-1 bg-blue-500 text-xs text-white rounded hover:bg-blue-600"
        >
          Sort by Name
        </button>
        <button
          onClick={() => toggleSortUser("categoryId")}
          className="px-2 py-1 bg-blue-500 text-xs text-white rounded hover:bg-blue-600"
        >
          Sort by Category
        </button>
      </div>
      {isFirstLoad ? (
        <SkeletonLoaderTable rows={5} columns={9} />
      ) : products.length > 0 ? (
        products.map((item, index) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 shadow-sm bg-gray-100"
          >
            <div className=" text-gray-500 text-sm">
              #{index + 1 + (pageProduct - 1) * limitProduct}
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 flex-shrink-0">
                {item.images.length > 0 ? (
                  <img
                    src={item.images[0].url}
                    className="w-full h-full object-cover rounded-md"
                    alt={`Product ${item.title || "No title"}`}
                  />
                ) : (
                  <div className="w-full h-full rounded-md bg-gray-300 flex items-center justify-center text-sm">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-sm md:text-lg">{item.title}</h2>
                <p className="text-sm text-gray-800">
                  หมวดหมู่: {item.category?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-800">
                  จำนวนรายการ: {item.quantity}
                </p>
                <p className="text-sm text-gray-800">
                  ราคา: {numberFormat(item.price)}
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Link
                to={`/admin/product/${item.id}`}
                className="bg-yellow-500 text-white rounded-md px-2 py-1 hover:bg-yellow-600"
              >
                <Pencil size={16} />
              </Link>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white rounded-md px-2 py-1 hover:bg-red-600"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>ไม่พบสินค้า</p>
      )}
    </div>
  );
};

export default ProductTableMobile;
