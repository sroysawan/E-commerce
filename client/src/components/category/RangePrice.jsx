import React, { useEffect, useState, useRef } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import debounce from "lodash.debounce";
import { SkeletonSearchCard } from "../ui/Skeletons";
import useEcomStore from "../../store/ecom-store";

const RangePrice = ({ loading, products }) => {
  const [price, setPrice] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(null);
  const [error, setError] = useState("");
  const isMaxPriceSet = useRef(false);
  const filterProductsByPrice = useEcomStore(
    (state) => state.filterProductsByPrice
  );
  const setFilteredProducts = useEcomStore(
    (state) => state.setFilteredProducts
  );

  // สร้าง debounced function สำหรับการ filter
  const debouncedPriceChange = useRef(
    debounce((products, priceRange) => {
      if (products && products.length > 0) {
        filterProductsByPrice(products, priceRange);
      }
    }, 500)
  ).current;

  // Reset state เมื่อ products เปลี่ยน
  useEffect(() => {
    if (products && products.length > 0) {
      isMaxPriceSet.current = false;
      const highestPrice = Math.max(...products.map((p) => p.price));
      setMaxPrice(highestPrice);
      setPrice([0, highestPrice]);
      setFilteredProducts(products); // รีเซ็ตสินค้าที่กรองให้เป็นสินค้าทั้งหมด
      isMaxPriceSet.current = true;
    }
  }, [products, setFilteredProducts]);

  // จัดการเมื่อราคาเปลี่ยน
  useEffect(() => {
    if (!products || products.length === 0) return;

    if (price[0] > price[1]) {
      setError("ช่วงราคาผิดพลาด: Min ต้องไม่มากกว่า Max");
      return;
    }

    setError("");
    debouncedPriceChange(products, price);
  }, [price, products]);

  // Cleanup
  useEffect(() => {
    return () => {
      debouncedPriceChange.cancel();
    };
  }, [debouncedPriceChange]);

  const handlePriceChange = (value) => {
    setPrice(value);
  };

  const clearAllFilters = () => {
    setPrice([0, maxPrice]);
  };

  if (loading) {
    return <SkeletonSearchCard />; // Render Skeleton UI when loading
  }
  return (
    <div className="sticky top-24 grid gap-y-5">
      <div className="bg-white h-full w-full shadow-lg md:p-3 xl:p-6 rounded-xl space-y-4">
        <div className="flex justify-between">
          <p className="font-bold text-xl">ตัวกรอง</p>
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            ล้างทั้งหมด
          </button>
        </div>
        <h1 className="text-lg font-semibold">ค้นหาราคา</h1>
        {maxPrice !== null && (
          <>
            <div className="flex justify-between gap-4">
              <input
                type="number"
                min={0}
                max={price[1]}
                value={price[0]}
                onChange={(e) => setPrice([+e.target.value, price[1]])}
                className="border p-2 rounded"
              />
              <span className="p-2 text-xl">-</span>
              <input
                type="number"
                min={price[0]}
                max={maxPrice}
                value={price[1]}
                onChange={(e) => setPrice([price[0], +e.target.value])}
                className="border p-2 rounded"
              />
            </div>
            <Slider
              range
              min={0}
              max={maxPrice}
              value={price}
              onChange={handlePriceChange}
            />
            {error && <p className="text-red-500">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default RangePrice;
