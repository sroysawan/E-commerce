import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import useEcomStore from "../../store/ecom-store";
import { numberFormat } from "../../utils/number";
import { motion } from "framer-motion";
const ProductCard = ({ item }) => {

  const actionAddtoCart = useEcomStore((state) => state.actionAddtoCart);
  const isLoading = useEcomStore((state) => state.isLoading);

  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
      <div className="border rounded-md shadow-md p-2 md:w-64 h-full space-y-3">
        <div>
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0].url}
              className="rounded-md w-full h-36 object-contain hover:scale-110 hover:duration-200"
            />
          ) : (
            <div
              className="w-full h-36 border
            bg-gray-300 rounded-md flex items-center justify-center shadow"
            >
              no image
            </div>
          )}
        </div>

        <div className="py-2">
          <p className="text-xl truncate">{item.title}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 truncate">
            {item.description}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <span
            className={`text-xl font-bold ${
              item.quantity <= 0
                ? "line-through decoration-red-600 decoration-4"
                : ""
            }`}
          >
            {numberFormat(item.price)}
          </span>
          {item.quantity <= 0 && (
            <span className="text-red-600 ml-2">Out Of Stock</span>
          )}

          <button
            className={`rounded-md p-2 shadow-md 
              ${
                item.quantity <= 0
                  ? "bg-gray-500"
                  : "bg-red-500 text-white hover:bg-red-700"
              }
            `}
            onClick={() => actionAddtoCart(item)}
            disabled={item.quantity <= 0}
          >
            <ShoppingCart />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
