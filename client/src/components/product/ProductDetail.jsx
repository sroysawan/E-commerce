import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { listDetailProduct } from "../../api/product";
import ProductImageSlider from "../ui/ProductImageSlider";
import { numberFormat } from "../../utils/number";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { Minus, Plus } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const carts = useEcomStore((state) => state.carts);
  const actionAddtoCart = useEcomStore((state) => state.actionAddtoCart);
  const checkProductInCart = useEcomStore((state) => state.checkProductInCart);
  const [product, setProduct] = useState();
  const [selectedQuantity, setSelectedQuantity] = useState(1); // จำนวนสินค้าที่ต้องการ
  const [showFullDescription, setShowFullDescription] = useState(false); // State สำหรับจัดการการแสดง description
  const [isClamped, setIsClamped] = useState(false); // State ตรวจสอบว่าต้องตัดข้อความหรือไม่
  const descriptionRef = useRef(null); // อ้างอิง DOM ของคำอธิบายสินค้า

  const navigate = useNavigate();

  useEffect(() => {
    if (isNaN(id)) {
      navigate("/404", { state: { error: "Invalid Product ID" } });
      return;
    }
    fetchProduct(id);
  }, [id, navigate]);

  const fetchProduct = async (id) => {
    try {
      const response = await listDetailProduct(id);
      if (response.data) {
        setProduct(response.data);
      } else {
        navigate("/404", { state: { error: "Product Not Found" } });
      }
    } catch (error) {
      console.error(error);
      navigate("/404", { state: { error: "Unable to fetch product data" } });
    }
  };

  const handleAddToCart = () => {
    if (selectedQuantity > product.quantity) {
      toast.warning("สินค้าคงเหลือไม่เพียงพอ!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return;
    }

    const success = actionAddtoCart({ ...product, count: selectedQuantity });
    if (success) {
      toast.success("เพิ่มสินค้าลงตะกร้าเรียบร้อย!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } else {
      toast.warning("ไม่สามารถเพิ่มสินค้าได้เกินจำนวนคงเหลือ!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  const increaseQuantity = () => {
    if (selectedQuantity < product.quantity) {
      setSelectedQuantity((prev) => prev + 1);
    } else {
      toast.warning("สินค้าคงเหลือเพียง " + product.quantity + " ชิ้น!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  const decreaseQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity((prev) => prev - 1);
    }
  };

  useEffect(() => {
    // ตรวจสอบว่าข้อความยาวเกิน 3 บรรทัดหรือไม่
    const element = descriptionRef.current;
    if (element) {
      const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * 4; // ความสูงสำหรับ 3 บรรทัด
      setIsClamped(element.scrollHeight > maxHeight);
    }
  }, [product?.description]);

  return (
    <div className="container mx-auto px-2 sm:px-2 md:px-0 lg:px-2 xl:px-0 my-4 xl:my-8">
      {product && (
        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          {/* Section: Images */}
          <div>
            <ProductImageSlider images={product.images || []} />
          </div>

          {/* Section: Details */}
          <div className="flex flex-col justify-between md:max-w-2xl space-y-4">
            <h1 className="text-xl xl:text-2xl font-bold text-gray-800">
              {product.title}
            </h1>

           {/* Description */}
           <div
              ref={descriptionRef}
              className={`text-gray-600 text-base xl:text-lg leading-relaxed ${
                !showFullDescription && isClamped ? "line-clamp-3 xl:line-clamp-none" : ""
              }`}
            >
              {product.description}
            </div>
            {isClamped && (
              <button
                className="text-red-500 hover:underline font-semibold xl:hidden"
                onClick={() => setShowFullDescription((prev) => !prev)}
              >
                {showFullDescription ? "แสดงน้อยลง" : "อ่านเพิ่มเติม"}
              </button>
            )}
            <p className="text-red-500 text-lg lg:text-xl xl:text-2xl font-bold">
              ฿{numberFormat(product.price)}
            </p>

            <div className="flex items-center space-x-4">
              <button
                className={`px-2 py-1 rounded-md transition ${
                  selectedQuantity <= 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" // ปุ่มสีเทาเมื่อสินค้าหมดหรือจำนวนเหลือ 1
                    : "text-red-500 bg-white border border-red-500 hover:bg-red-500 hover:text-white" // ปุ่มปกติ
                }`}
                onClick={decreaseQuantity}
                disabled={product.quantity <= 1}
              >
                <Minus />
              </button>
              <span className="text-lg font-semibold w-10 text-center ">
                {selectedQuantity}
              </span>
              <button
                className={`px-3 py-1 ${
                  selectedQuantity >= product.quantity
                    ? "bg-gray-300 text-gray-500"
                    : "bg-white border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                } rounded-md`}
                onClick={increaseQuantity}
                disabled={selectedQuantity >= product.quantity}
              >
                <Plus />
              </button>
            </div>

            {product.quantity === 0 && (
              <p className="text-red-600 font-bold">Out of Stock</p>
            )}

            <div className="flex space-x-4">
              <button
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition ${
                      product.quantity === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" // เมื่อของหมด
                        : "border border-red-600 text-red-600 hover:bg-red-700 hover:text-white" // เมื่อยังมีของ
                    }`}
                onClick={handleAddToCart}
                style={{ pointerEvents: product.quantity === 0 ? "none" : "auto" }}
              >
                Add to Cart
              </button>
              <Link
              to={'/cart'}
              className={`w-full text-center px-6 py-3 rounded-lg font-semibold transition ${
                product.quantity === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" // เมื่อของหมด
                  : "bg-red-600 text-white hover:bg-red-700" // เมื่อยังมีของ
              }`}
                onClick={handleAddToCart}
                style={{ pointerEvents: product.quantity === 0 ? "none" : "auto" }}
              >
                {" "}
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
