import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { Link } from "react-router-dom";
import {
  Cpu,
  Keyboard,
  Laptop,
  Microchip,
  Monitor,
  Mouse,
  Package,
} from "lucide-react";
import { capitalize, createSlug } from "../../utils/slugFormat";

const CategoryProduct = () => {
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true); // เริ่มโหลด
    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      await getCategory(); // ดึงข้อมูล
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // จบการโหลดข้อมูล
    }
  };
  // ฟังก์ชันสำหรับกำหนดไอคอนตามชื่อหมวดหมู่
  const getIcon = (name) => {
    const lowercaseName = name.toLowerCase();
    switch (lowercaseName.toLowerCase()) {
      case "monitor":
        return <Monitor className="icons" />;
      case "mouse":
        return <Mouse className="icons" />;
      case "keyboard":
        return <Keyboard className="icons" />;
      case "notebook":
        return <Laptop className="icons" />;
      case "cpu":
        return <Cpu className="icons" />;
      case "gpu":
        return <Microchip className="icons -rotate-90" />;
      default:
        return <Package className="icons" />;
    }
  };
  const renderSkeleton = () => (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 md:gap-8">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="w-full flex items-center justify-center bg-gray-200 p-2 rounded-lg shadow animate-pulse"
          >
            <span className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="w-20 h-4 bg-gray-300 rounded"></div>
            </span>
          </div>
        ))}
    </div>
  );

  return (
    <>
      {loading ? (
        renderSkeleton() // แสดง Skeleton ระหว่างโหลด
      ) : categories && categories.length > 0 ? ( // ตรวจสอบว่ามีข้อมูลใน categories
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 md:gap-8">
          {categories.map((item, index) => (
            <Link
              key={index}
              to={`/category/${createSlug(item.name)}`}
              className="w-full flex items-center justify-center 
              bg-white p-2 rounded-lg shadow-lg 
              hover:shadow-slate-500 hover:text-red-500"
            >
              <span className="flex items-center justify-center py-2 gap-3 font-semibold text-xs md:text-sm uppercase">
                {getIcon(item.name)} {/* แสดงไอคอน */}
                {item.name} {/* แสดงชื่อหมวดหมู่ */}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">ไม่มีหมวดหมู่สินค้า</p> // แสดงข้อความเมื่อไม่มีข้อมูล
      )}
    </>
  );
};

export default CategoryProduct;
