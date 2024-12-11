import React, { useEffect, useRef, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import useEcomStore from "../../store/ecom-store";
import { debounce } from "lodash";
import Slider from "rc-slider";

const SideBarFilter = ({ isSidebarFilterOpen, toggleSideBarFilter, children }) => {
  const filterProductsByCategoryAndPrice = useEcomStore(
    (state) => state.filterProductsByCategoryAndPrice
  );
  const filteredProducts = useEcomStore((state) => state.filteredProducts);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);

  const [categorySelected, setCategorySelected] = useState([]); // เก็บหมวดหมู่ที่เลือก
  const [price, setPrice] = useState([0, 0]); // เก็บช่วงราคาที่เลือก
  const [maxPrice, setMaxPrice] = useState(null); // เก็บราคาสูงสุดที่ใช้ใน Slider
  const [error, setError] = useState(""); // ข้อความแสดงข้อผิดพลาดเกี่ยวกับช่วงราคา
  const isMaxPriceSet = useRef(false); // ใช้ตรวจสอบว่า maxPrice ถูกตั้งค่าแล้วหรือยัง

  // Create debounced filter function
  const debouncedFilter = useRef(
    debounce((category, priceRange) => {
      filterProductsByCategoryAndPrice({
        category: category.length ? category : undefined,
        price: priceRange,
      });
    }, 500)
  ).current;

  //ดึงสินค้า หมวดหมู่ทั้งหมดจาก API หรือ Store เมื่อ component โหลดครั้งแรก
  useEffect(() => {
    getCategory();

    return () => {
      debouncedFilter.cancel();
    };
  }, []);

  //ดึงราคาสูงสุดของสินค้ามาตั้งค่า maxPrice และ price ครั้งแรกที่มีการโหลดสินค้า
  useEffect(() => {
    if (filteredProducts.length > 0 && !isMaxPriceSet.current) {
      const highestPrice = Math.max(...filteredProducts.map((p) => p.price));
      setMaxPrice(highestPrice);
      setPrice([0, highestPrice]);
      isMaxPriceSet.current = true;
    }
  }, [filteredProducts]);

  useEffect(() => {
    if (price[0] > price[1]) {
      setError("ช่วงราคาผิดพลาด: Min ต้องไม่มากกว่า Max");
    } else {
      setError("");
      debouncedFilter(categorySelected, price);
    }
  }, [categorySelected, price]);

  //เพิ่มหรือลบหมวดหมู่ที่เลือกตามค่าที่ผู้ใช้คลิกใน checkbox
  const handleCheck = (e) => {
    const value = e.target.value;
    const updatedCategories = categorySelected.includes(value)
      ? categorySelected.filter((id) => id !== value)
      : [...categorySelected, value];
    setCategorySelected(updatedCategories);
  };

  console.log('categorySelected:', categorySelected)
console.log('Type of categorySelected values:', categorySelected.map(id => typeof id))

  //อัปเดตช่วงราคาตามการเลื่อน Slider
  const handlePriceChange = (value) => {
    setPrice(value);
  };
  const clearAllFilters = () => {
    setCategorySelected([]);
    setPrice([0, maxPrice]);
  };
  return (
    <>
      {/* Toggle Button for mobile */}
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
          <div className="h-full w-full p-4  space-y-4">
            <div className="flex justify-between">
              <p>ตัวกรอง</p>
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                ล้างทั้งหมด
              </button>
            </div>
            <div className="space-y-2 mt-5">
              <h1 className="text-lg font-bold">หมวดหมู่สินค้า</h1>
              <div>
                {categories?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 text-base uppercase"
                  >
                    <input
                      type="checkbox"
                      className="size-4 rounded border-gray-300 hover:cursor-pointer"
                      value={item.id}
                      onChange={handleCheck}
                      checked={categorySelected.includes(item.id.toString())} // หรือ Number(item.id) ขึ้นอยู่กับ type
                    />
                    <label>{item.name}</label>
                  </div>
                ))}
              </div>
            </div>
            <hr />
            {/* Search Price */}
            <div className="space-y-2">
              <h1 className="text-lg font-bold">ค้นหาราคา</h1>
              {maxPrice !== null ? (
                <>
                  <div className="flex justify-between ">
                    <input
                      type="number"
                      min={0}
                      max={price[1]}
                      value={price[0]}
                      onChange={(e) => setPrice([+e.target.value, price[1]])}
                      className="border p-2 rounded w-24 text-sm"
                    />
                    <span className="items-center text-xl">-</span>
                    <input
                      type="number"
                      min={price[0]}
                      max={maxPrice}
                      value={price[1]}
                      onChange={(e) => setPrice([price[0], +e.target.value])}
                      className="border p-2 rounded w-24 text-sm"
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
              ) : (
                // <p>กำลังโหลดข้อมูลราคา...</p>
                ""
              )}
            </div>
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

export default SideBarFilter;
