import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import useEcomStore from "../../store/ecom-store";
import { numberFormat } from "../../utils/number";
import { useNavigate } from "react-router-dom";
import { createSlug } from "../../utils/slugFormat";
import { toast } from "react-toastify";
import {SkeletonProductCard} from '../ui/Skeletons'
const ProductCard = ({ item, view, loading }) => {
  const actionAddtoCart = useEcomStore((state) => state.actionAddtoCart);
  const navigate = useNavigate();

  const handleNavigateToProduct = () => {
    navigate(`/product/${item.id}/${createSlug(item.title)}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (item.quantity <= 0) {
      toast.warning("สินค้าหมดสต็อก!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return;
    }

    const success = actionAddtoCart({ ...item, count: 1 });
    if (success) {
      toast.success("เพิ่มสินค้าลงตะกร้าเรียบร้อย!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } else {
      toast.warning("ไม่สามารถเพิ่มสินค้าได้เกินจำนวนคงเหลือ!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };
  if (loading) {
    return (
      <SkeletonProductCard view={view} />
    );
  }

  return (
    <div
      onClick={handleNavigateToProduct}
      className={`relative border rounded-md shadow-lg p-2 cursor-pointer bg-white ${
        view === "list"
          ? "flex flex-col md:flex-row items-start  md:max-h-[195px] w-full"
          : "md:w-60 "
      }`}
    >
      {item.quantity <= 0 && (
        <div
          className={`absolute  bg-red-600 text-white text-sm px-2 py-1 rounded shadow-md z-10 ${
            view === "list" ? "" : "top-2 left-2"
          }`}
        >
          Out of Stock
        </div>
      )}
      <div className={`${view === "list" ? "w-full md:w-1/3 p-4" : "mb-3"}`}>
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0].url}
            // className="rounded-md w-full h-36 object-contain hover:scale-110 hover:duration-200"
            className={`rounded-md w-full object-contain hover:scale-110 hover:duration-200 ${
              item.quantity <= 0 ? "opacity-50" : ""
            } ${view === "list" ? "w-full h-24 md:h-36" : "h-24 md:h-36"}`}
          />
        ) : (
          <div
            className="w-full h-24 md:h-36 border
            bg-gray-300 rounded-md flex items-center justify-center shadow"
          >
            no image
          </div>
        )}
      </div>

      <div
        className={`${
          view === "list"
            ? "flex flex-col w-full h-full md:w-2/3 px-2 justify-between"
            : "py-2 space-y-3"
        }`}
      >
        <p
          className={`text-sm md:text-lg ${
            view === "list"
              ? "flex flex-col w-full pt-2 mb-1"
              : "h-10 md:h-20 line-clamp-1 md:line-clamp-3"
          }`}
          title={item.title}
        >
          {item.title}
        </p>

        <p
          className={`text-sm text-gray-500 ${
            view === "list" ? "line-clamp-2 mb-1" : "truncate min-h-6"
          } `}
        >
          {item.description || "\u00A0"}{" "}
          {/* ใช้ non-breaking space แทนถ้าไม่มีคำอธิบาย */}
        </p>

        <div
          className={`flex justify-between items-center ${
            view === "list" ? "pb-2" : ""
          }`}
        >
          <span
            className={`text-base md:text-xl font-bold ${
              item.quantity <= 0
                ? "line-through decoration-red-600 decoration-4"
                : "text-black"
            }`}
          >
            ฿{numberFormat(item.price)}
          </span>

          <button
            className={`rounded-md p-1.5 md:p-2 shadow-md 
              ${
                item.quantity <= 0
                  ? "bg-gray-500"
                  : "bg-red-500 text-white hover:bg-red-700"
              }
              `}
            onClick={handleAddToCart} // ใช้ฟังก์ชันที่แยก
            disabled={item.quantity <= 0}
          >
            {/* <ShoppingCart /> */}
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
