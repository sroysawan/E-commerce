import React, { useEffect, useState, useRef } from "react";
import useEcomStore from "../../store/ecom-store";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { SkeletonSearchCard } from "../ui/Skeletons";
import debounce from "lodash.debounce";

const SearchCard = ({ loading }) => {
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

  //อัปเดตช่วงราคาตามการเลื่อน Slider
  const handlePriceChange = (value) => {
    setPrice(value);
  };

  const clearAllFilters = () => {
    setCategorySelected([]);
    setPrice([0, maxPrice]);
  };

  if (loading) {
    return <SkeletonSearchCard />; // Render Skeleton UI when loading
  }

  return (
    <div className="sticky top-24 grid gap-y-5">
      <div className="bg-white h-full w-full shadow-lg p-6 rounded-xl space-y-4">
        <div className="flex justify-between">
          <p className="font-bold text-xl">ตัวกรอง</p>
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            ล้างทั้งหมด
          </button>
        </div>
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">หมวดหมู่สินค้า</h1>
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
          <h1 className="text-lg font-semibold">ค้นหาราคา</h1>
          {maxPrice !== null ? (
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
          ) : (
            // <p>กำลังโหลดข้อมูลราคา...</p>
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
