import React, { useState, useEffect } from "react";

const ProductImageSlider = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0); // ตำแหน่งเริ่มต้นของแกลเลอรีเล็ก
  const [thumbnailWidth, setThumbnailWidth] = useState(5); // จำนวนภาพเล็กที่จะแสดง
  const [spaceBetween, setSpaceBetween] = useState("space-x-7"); // ระยะห่างระหว่างภาพเล็ก

  useEffect(() => {
    // ตรวจสอบขนาดหน้าจอเพื่อกำหนดค่า thumbnailWidth และ space-x
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setThumbnailWidth(3); // แสดง 3 ภาพเล็กในโหมด Mobile
        setSpaceBetween("space-x-4"); // ระยะห่างระหว่างภาพเล็กใน Mobile
      } else {
        setThumbnailWidth(5); // แสดง 5 ภาพเล็กใน Desktop
        setSpaceBetween("space-x-7"); // ระยะห่างระหว่างภาพเล็กใน Desktop
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    updateThumbnailPosition(newIndex);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    updateThumbnailPosition(newIndex);
  };

  const updateThumbnailPosition = (newIndex) => {
    if (newIndex >= startIndex + thumbnailWidth) {
      setStartIndex(newIndex - thumbnailWidth + 1);
    } else if (newIndex < startIndex) {
      setStartIndex(newIndex);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {images.length > 0 ? (
        <div className="relative">
          {/* Main Image with Arrows */}
          <div className="w-full h-80 shadow-lg rounded-lg flex items-center justify-center relative">
            <button
              className="absolute left-0 bg-gray-800 text-white p-2 rounded-full z-10"
              onClick={goToPrevious}
            >
              ◀
            </button>
            <img
              src={images[currentIndex].url}
              alt={`Product image ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
            <button
              className="absolute right-0 bg-gray-800 text-white p-2 rounded-full z-10"
              onClick={goToNext}
            >
              ▶
            </button>
          </div>
          {/* Thumbnails */}
          <div
            className={`flex justify-center mt-4 overflow-hidden ${spaceBetween}`}
          >
            {images.slice(startIndex, startIndex + thumbnailWidth).map((image, index) => (
              <img
                key={startIndex + index}
                src={image.url}
                alt={`Thumbnail ${startIndex + index + 1}`}
                className={`w-20 h-20 border ${
                  startIndex + index === currentIndex
                    ? "border-blue-500"
                    : "border-gray-300"
                } rounded-md cursor-pointer object-cover`}
                onClick={() => setCurrentIndex(startIndex + index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-80 bg-gray-300 rounded-md flex items-center justify-center">
          No image
        </div>
      )}
    </div>
  );
};

export default ProductImageSlider;

