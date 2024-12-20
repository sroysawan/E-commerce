import React, { useEffect, useState, useRef } from "react";
import ProductCard from "../components/cart/ProductCard";
import useEcomStore from "../store/ecom-store";
import SearchCard from "../components/cart/SearchCard";
import ViewButton from "../components/ui/ViewButton";
import PaginationProduct from "../components/ui/PaginationProduct";
import SideBarFilter from "../components/ui/SideBarFilter";

const Shop = () => {
  const getProduct = useEcomStore((state) => state.getProduct);
  const filteredProductShop = useEcomStore(
    (state) => state.filteredProductShop
  );
  const [view, setView] = useState("module");
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  const [initialSearchCardLoad, setInitialSearchCardLoad] = useState(true); // เพิ่ม state สำหรับ SearchCard
  const [isSidebarFilterOpen, setIsSidebarFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const loadingTimeoutRef = useRef(null);
  const dataTimeoutRef = useRef(null);

  // Calculate pagination
  const totalPages = Math.ceil(
    (filteredProductShop?.length || 0) / itemsPerPage
  );
  // ปรับให้ startIndex เริ่มต้นจาก 1 และแสดงสินค้าทั้งหมดรวมถึง index 0
  const startIndex = (currentPage - 1) * itemsPerPage + 1; // ยังคงเริ่มต้นที่ 1
  const endIndex = Math.min(
    startIndex + itemsPerPage - 1,
    filteredProductShop?.length || 0
  ); // คำนวณเพื่อไม่ให้เกินจำนวนสินค้าจริง

  // แต่ดึงสินค้าจาก index ตามจริงเพื่อไม่ให้สินค้าที่ index 0 หายไป
  const currentProducts =
    filteredProductShop?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  // Reset to first page when filtered products change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProductShop]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top smoothly
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
    const loadInitialData = async () => {
      setShowSkeleton(true);
      setIsDataReady(false);

      try {
        await getProduct();
        setTimeout(() => {
          setShowSkeleton(false);
          setIsDataReady(true);
          setInitialSearchCardLoad(false);
        }, 500); // delay smooth
      } catch (error) {
        console.error("Error loading products:", error);
        setShowSkeleton(false);
        setIsDataReady(true);
        setInitialSearchCardLoad(false);
      }
    };
    loadInitialData();
    // Cleanup on unmount
    return () => {
      cleanupTimeouts();
    };
  }, [getProduct]);

  // Handle filtered products changes
  useEffect(() => {
    if (filteredProductShop && isDataReady) {
      setShowSkeleton(true);
      setIsDataReady(false);
      setCurrentPage(1); // Reset to first page when category changes
      setTimeout(() => {
        setShowSkeleton(false);
        setIsDataReady(true); // ข้อมูลพร้อมจะแสดง
      }, 500); // delay ช่วงสั้นเพื่อ smooth UX
      return () => {
        cleanupTimeouts();
      };
    }
  }, [filteredProductShop]);

  const toggleSideBarFilter = () => {
    setIsSidebarFilterOpen(!isSidebarFilterOpen);
  };
  const shouldShowContent = !showSkeleton && isDataReady;

  return (
    <div className="container mx-auto px-2 sm:px-2 md:px-0 lg:px-2 xl:px-0 mt-4 xl:mt-8">
      <div className="w-full bg-white h-20 md:h-24 shadow-lg rounded-lg flex px-4 md:px-6">
        <div className="flex flex-1 items-center justify-between ">
          <div>
            <h1 className="text-base md:text-xl font-bold">สินค้าทั้งหมด</h1>
            <h1 className="text-xs md:text-base">
              จำนวน {shouldShowContent ? filteredProductShop?.length || 0 : 0}{" "}
              รายการ
            </h1>
          </div>
          <div className="flex items-center gap-x-3">
            <SideBarFilter
              isSidebarFilterOpen={isSidebarFilterOpen}
              toggleSideBarFilter={toggleSideBarFilter}
            ></SideBarFilter>
            <ViewButton view={view} setView={setView} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[20%_80%] py-4 md:py-4 xl:space-x-4">
        <div className="hidden xl:flex xl:justify-start">
          <div className="w-full pr-5 mb-0">
            <SearchCard loading={initialSearchCardLoad} />
          </div>
        </div>
        <div className="grid">
          <div
            className={`${
              view === "list"
                ? "grid grid-cols-1 space-y-4"
                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 xl:gap-x-[80px]"
            }  md:mx-0`}
          >
            {showSkeleton || !isDataReady
              ? Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <ProductCard
                      key={`skeleton-${index}`}
                      loading={true}
                      view={view}
                    />
                  ))
              : currentProducts?.map((item, index) => (
                  <ProductCard
                    key={`product-${item.id}-${index}`}
                    item={item}
                    view={view}
                    loading={false}
                  />
                ))}
          </div>
          {/* Pagination */}
          {shouldShowContent && filteredProductShop?.length > 0 && (
            <div className="mt-6">
              <PaginationProduct
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                totalProducts={filteredProductShop.length}
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

export default Shop;
