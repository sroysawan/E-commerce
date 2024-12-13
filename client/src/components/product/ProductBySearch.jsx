import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import useEcomStore from "../../store/ecom-store";
import ProductCard from "../cart/ProductCard";
import SearchText from "../ui/SearchText";
import ViewButton from "../ui/ViewButton";
import PaginationProduct from "../ui/PaginationProduct";

const ProductBySearch = () => {
  const actionSearchFilters = useEcomStore(
    (state) => state.actionSearchFilters
  );
  const [products, setProducts] = useState([]); // รายการสินค้าที่แสดงผล
  const [searchParams] = useSearchParams(); // ใช้สำหรับดึง query string
  // const query = searchParams.get("query") || ""; // ดึง query จาก URL
  const { query } = useParams();
  const [view, setView] = useState("module"); // ค่าเริ่มต้นเป็น module
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Calculate pagination
  const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);
  // ปรับให้ startIndex เริ่มต้นจาก 1 และแสดงสินค้าทั้งหมดรวมถึง index 0
  const startIndex = (currentPage - 1) * itemsPerPage + 1; // ยังคงเริ่มต้นที่ 1
  const endIndex = Math.min(
    startIndex + itemsPerPage - 1,
    products?.length || 0
  ); // คำนวณเพื่อไม่ให้เกินจำนวนสินค้าจริง

  // แต่ดึงสินค้าจาก index ตามจริงเพื่อไม่ให้สินค้าที่ index 0 หายไป
  const currentItems =
    products?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  // ดึงสินค้าตามคำค้นหาจาก store
  const fetchProducts = async (searchQuery) => {
    setIsLoading(true);
    try {
      await actionSearchFilters({ query: searchQuery });
      const fetchedProducts = useEcomStore.getState().searchResults;
      setProducts(fetchedProducts);
      setHasSearched(true);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // เรียก fetchProducts เมื่อ query ใน URL เปลี่ยนแปลง
  useEffect(() => {
    if (query) {
      fetchProducts(query);
    }
  }, [query]);

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

  return (
    <div className="container mx-auto px-2 sm:px-2 md:px-0 lg:px-2 xl:px-0 mt-4 xl:mt-8">
      {/* Header */}
      <div className="w-full bg-white h-20 md:h-24 shadow-lg rounded-lg flex px-4 md:px-6">
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-base md:text-xl font-bold">ค้นหาสินค้า '{query}'</h1>
            <h1 className="text-xs md:text-base">
              {!isLoading && products.length > 0
                ? `${products.length} รายการ`
                : "ไม่พบผลลัพธ์"}
            </h1>
          </div>
          <div className="flex space-x-2">
            <ViewButton view={view} setView={setView} />
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className={`grid py-4 xl:py-8${view === "list" ? "grid-cols-1 " : " xl:space-x-4"}`}>
        <div
          className={`${
            view === "list"
              ? "grid grid-cols-1 space-y-4"
              : "grid grid-cols-2 place-content-between gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-[84px]"
          } md:mx-0`}
        >
          {isLoading ? (
            // Show skeletons while loading
            Array(10)
              .fill(0)
              .map((_, index) => (
                <ProductCard key={`skeleton-${index}`} loading view={view} />
              ))
          ) : products.length > 0 ? (
            // Show products if we have results
            currentItems.map((item, index) => (
              <ProductCard
                key={`product-${item.id}-${index}`}
                item={item}
                view={view}
                loading={false}
              />
            ))
          ) : hasSearched ? (
            // Show no results message if we've searched but found nothing
            <div className="col-span-full flex justify-center items-center h-64">
              <p className="text-center text-xl text-gray-500">
                ไม่พบสินค้าที่ตรงกับคำค้นหา
              </p>
            </div>
          ) : null}
        </div>
        {/* Pagination */}
        {products.length > 0 && (
          <div className="mt-6">
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
  );
};

export default ProductBySearch;
