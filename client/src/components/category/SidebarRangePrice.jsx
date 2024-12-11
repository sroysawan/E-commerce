import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import TuneIcon from "@mui/icons-material/Tune";
import Slider from "rc-slider";
import { debounce } from "lodash";
import useEcomStore from "../../store/ecom-store";
const SidebarRangePrice = ({
  isSidebarFilterOpen,
  toggleSideBarFilter,
  products,
}) => {
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
  return (
    <>
      <div className="xl:hidden">
        <ToggleButtonGroup onClick={toggleSideBarFilter}>
          <ToggleButton>
            <TuneIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {/* Sidebar Content */}
      <div
        className={`fixed xl:relative inset-y-0 left-0 bg-white z-50 w-64 max-w-xs shadow-lg transform ${
          isSidebarFilterOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {isSidebarFilterOpen ? (
           <div className="h-full w-full p-4 space-y-4">
            <div className="flex justify-between">
              <p>ตัวกรอง</p>
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                ล้างทั้งหมด
              </button>
            </div>
            <h1 className="text-lg font-bold">ค้นหาราคา</h1>
            {maxPrice !== null && (
              <>
                <div className="flex justify-between">
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
        ) : (
          ""
        )}
      </div>

      {/* Overlay for mobile */}
      {isSidebarFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
          onClick={toggleSideBarFilter}
        />
      )}
    </>
  );
};

export default SidebarRangePrice;
