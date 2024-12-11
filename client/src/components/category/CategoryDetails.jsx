import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../cart/ProductCard";
import { listByCategory } from "../../api/category";
import useEcomStore from "../../store/ecom-store";
import ViewButton from "../ui/ViewButton";
import { createSlug } from "../../utils/slugFormat";
import PaginationProduct from "../ui/PaginationProduct";
import RangePrice from "./RangePrice";
import SidebarRangePrice from "./SidebarRangePrice";

const CategoryDetails = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const categories = useEcomStore((state) => state.categories);
  // const category = categories.find((item) => createSlug(item.name) === id);
  const category = categories.find(
    (item) => createSlug(item.name) === decodeURIComponent(id)
  );
  
  const [view, setView] = useState("module");
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  const [initialSearchCardLoad, setInitialSearchCardLoad] = useState(true); // เพิ่ม state สำหรับ SearchCard
  const [isSidebarFilterOpen, setIsSidebarFilterOpen] = useState(false);

  // เพิ่ม state ใหม่เพื่อเก็บสินค้าต้นฉบับ
  const [initialProducts, setInitialProducts] = useState([]);
  // ใช้ filteredProducts จาก store แทน products state เดิม
  const filteredProductCategory = useEcomStore(
    (state) => state.filteredProductCategory
  );
  const setFilteredProducts = useEcomStore(
    (state) => state.setFilteredProducts
  );

  const loadingTimeoutRef = useRef(null);
  const dataTimeoutRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Calculate pagination
  const totalPages = Math.ceil(
    (filteredProductCategory?.length || 0) / itemsPerPage
  );
  // ปรับให้ startIndex เริ่มต้นจาก 1 และแสดงสินค้าทั้งหมดรวมถึง index 0
  const startIndex = (currentPage - 1) * itemsPerPage + 1; // ยังคงเริ่มต้นที่ 1
  const endIndex = Math.min(
    startIndex + itemsPerPage - 1,
    filteredProductCategory?.length || 0
  ); // คำนวณเพื่อไม่ให้เกินจำนวนสินค้าจริง

  // แต่ดึงสินค้าจาก index ตามจริงเพื่อไม่ให้สินค้าที่ index 0 หายไป
  const currentItems =
    filteredProductCategory?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  // Cleanup function for timeouts
  const cleanupTimeouts = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    if (dataTimeoutRef.current) {
      clearTimeout(dataTimeoutRef.current);
    }
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setShowSkeleton(true);
      setIsDataReady(false);

      try {
        const res = await listByCategory(id);
        const categoryProducts = res.data;
        // เก็บสินค้าต้นฉบับ
        setInitialProducts(categoryProducts);
        // เก็บสินค้าใน store สำหรับการแสดงผล
        setFilteredProducts(categoryProducts);
        setCurrentPage(1); // Reset to first page when category changes
        setInitialSearchCardLoad(false);
        // Minimum skeleton display time
        loadingTimeoutRef.current = setTimeout(() => {
          setShowSkeleton(false);
          setInitialSearchCardLoad(false);
          // Add a small delay before showing the actual data
          dataTimeoutRef.current = setTimeout(() => {
            setIsDataReady(true);
          }, 100);
        }, 1000);
      } catch (error) {
        console.error("Error fetching category products:", error);
        setShowSkeleton(false);
        setIsDataReady(true);
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();

    // Cleanup on unmount or when id changes
    return () => {
      cleanupTimeouts();
    };
  }, [id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProductCategory]);

  useEffect(() => {
    if (filteredProductCategory && isDataReady) {
      setShowSkeleton(true);
      setIsDataReady(false);
      setCurrentPage(1); // Reset to first page when category changes
      loadingTimeoutRef.current = setTimeout(() => {
        setShowSkeleton(false);

        dataTimeoutRef.current = setTimeout(() => {
          setIsDataReady(true);
        }, 100);
      }, 300); // Reduced time for filtering operations

      return () => {
        cleanupTimeouts();
      };
    }
  }, [filteredProductCategory]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setTimeout(() => {
      const mainContainer = document.querySelector("main");
      if (mainContainer) {
        mainContainer.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }, 100);
  };


  const toggleSideBarFilter = () => {
    console.log("first");
    setIsSidebarFilterOpen(!isSidebarFilterOpen);
  };

  const shouldShowContent = !showSkeleton && isDataReady;
  const shouldShowSkeleton = showSkeleton || !isDataReady;

  // console.log(category);
  return (
    <div className="container mx-auto px-2 sm:px-2 md:px-0 lg:px-2 xl:px-0 mt-4 xl:mt-8">
      <div className="w-full bg-white h-20 md:h-24 shadow-lg rounded-lg flex px-4 xl:px-6">
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-base md:text-xl font-bold uppercase">
              {/* {category ? category.name : "หมวดหมู่ไม่ถูกต้อง"} */}
              {decodeURIComponent(id)}
            </h1>
            <h1 className="text-xs md:text-base">
              จำนวน {shouldShowContent ? filteredProductCategory.length : 0}{" "}
              รายการ
            </h1>
          </div>
          <div className="flex items-center gap-x-3">
            <SidebarRangePrice
              isSidebarFilterOpen={isSidebarFilterOpen}
              toggleSideBarFilter={toggleSideBarFilter}
              products={initialProducts}
            ></SidebarRangePrice>
            <ViewButton view={view} setView={setView} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[20%_80%] py-4 xl:py-8 xl:space-x-4">
        <div className="hidden xl:flex xl:justify-start">
          <div className="w-full xl:pr-5 mb-0">
            <RangePrice
              loading={initialSearchCardLoad}
              products={initialProducts}
            />
          </div>
        </div>

        <div className="grid">
          <div
            className={`${
              view === "list"
                ? "grid grid-cols-1 space-y-4"
                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 xl:gap-x-[80px] "
            } md:mx-0`}
          >
            {shouldShowSkeleton ? (
              Array(8)
                .fill(0)
                .map((_, index) => (
                  <ProductCard
                    key={`skeleton-${index}`}
                    loading={true}
                    view={view}
                  />
                ))
            ) : currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <ProductCard
                  key={`product-${item.id}-${index}`}
                  item={item}
                  view={view}
                  loading={false}
                />
              ))
            ) : (
              <div className=" flex justify-center items-center">
                <p className="text-center text-xl text-gray-500">
                  ไม่พบสินค้าในหมวดหมู่นี้
                </p>
              </div>
            )}
          </div>
          {shouldShowContent && filteredProductCategory.length > 0 && (
            <div className=" mt-6">
              <PaginationProduct
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                totalProducts={products.length}
                startIndex={startIndex}
                endIndex={endIndex}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;
