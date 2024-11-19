import React, { useEffect } from "react";
import ProductCard from "../components/cart/ProductCard";
import useEcomStore from "../store/ecom-store";
import SearchCard from "../components/cart/SearchCard";
import CartCard from "../components/cart/CartCard";

const Shop = () => {
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);
  
console.log(products)
  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="pt-8 container mx-auto grid grid-cols-[15%_60%_25%]">
      <div className="pr-5 mb-0">
        {/* Search  */}
        <SearchCard />
      </div>

      <div className="p-4 mb-8 ">
        <h1 className="text-xl font-bold">สินค้าทั้งหมด</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8 ">
          {/* Product  */}
          {products?.map((item, index) => (
            <ProductCard key={index} item={item} />
          ))}
        </div>
      </div>

      <div className="pl-5 mb-0">
        {/* Cart  */}
        <CartCard />
      </div>
    </div>
  );
};

export default Shop;
