import { ArrowLeft, ArrowRight, Loader2, X } from "lucide-react";
import React, { useState, useEffect } from "react";

const ProductImageSlider = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0); // ตำแหน่งเริ่มต้นของแกลเลอรีเล็ก
  const [thumbnailWidth, setThumbnailWidth] = useState(5); // จำนวนภาพเล็กที่จะแสดง
  const [spaceBetween, setSpaceBetween] = useState("space-x-7"); // ระยะห่างระหว่างภาพเล็ก
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
  };

  const handleClose = () => {
    setIsClicked(false);
  };
  useEffect(() => {
    // ตรวจสอบขนาดหน้าจอเพื่อกำหนดค่า thumbnailWidth และ space-x
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setThumbnailWidth(3); // แสดง 3 ภาพเล็กในโหมด Mobile
        setSpaceBetween("space-x-4"); // ระยะห่างระหว่างภาพเล็กใน Mobile
      } else if (window.innerWidth <= 1024) {
        setThumbnailWidth(4); // แสดง 3 ภาพเล็กในโหมด Mobile
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

  // เพิ่ม Effect สำหรับ Preload รูปภาพทั้งหมด
  useEffect(() => {
    const preloadImages = () => {
      setIsLoading(true);
      const imagePromises = images.map((image, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = image.url;
          img.onload = () => {
            setLoadedImages((prev) => ({ ...prev, [index]: true }));
            resolve();
          };
          img.onerror = () => {
            setLoadedImages((prev) => ({ ...prev, [index]: true }));
            resolve();
          };
        });
      });

      Promise.all(imagePromises).then(() => {
        setIsLoading(false);
      });
    };

    if (images.length > 0) {
      preloadImages();
    }
  }, [images]);

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
    <div className="w-full max-w-lg mx-auto ">
      {images.length > 0 ? (
        <div className="relative">
          {/* Main Image with Arrows */}
          <div className="w-full h-80 shadow-lg rounded-lg flex items-center justify-center relative">
            <button
              className="absolute left-0 xl:-left-5  bg-gray-800 text-white p-1 md:p-2 rounded-full z-10 hover:bg-gray-600"
              onClick={goToPrevious}
            >
              <ArrowLeft />
            </button>

            <img
              src={images[currentIndex].url}
              alt={`Product image ${currentIndex + 1}`}
              className="w-full h-full object-contain bg-white cursor-pointer"
              onClick={handleClick}
            />

            <button
              className="absolute right-0 xl:-right-5 bg-gray-800 text-white p-1 md:p-2 rounded-full z-10 hover:bg-gray-600"
              onClick={goToNext}
            >
              <ArrowRight />
            </button>
          </div>
          {/* Thumbnails */}
          <div
            className={`flex justify-center mt-4 overflow-hidden ${spaceBetween}`}
          >
            {images
              .slice(startIndex, startIndex + thumbnailWidth)
              .map((image, index) => (
                <div
                  key={startIndex + index}
                  className="relative flex-shrink-0"
                >
                  {!loadedImages[startIndex + index] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    </div>
                  )}
                  <img
                    src={image.url}
                    alt={`Thumbnail ${startIndex + index + 1}`}
                    className={`w-20 h-20 border rounded-md cursor-pointer object-cover transition-opacity duration-300 ${
                      startIndex + index === currentIndex
                        ? "border-blue-500"
                        : "border-gray-300"
                    } ${
                      loadedImages[startIndex + index]
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                    onClick={() => setCurrentIndex(startIndex + index)}
                  />
                </div>
              ))}
          </div>
          {isClicked && (
            <div
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
              onClick={handleClose}
            >
              <div className="relative">

              <img
                src={images[currentIndex].url}
                alt={`Product image ${currentIndex + 1}`}
                className="max-w-full max-h-full rounded-md "
                />
              <spa
                className="absolute top-1 -right-1 px-2 py-0.5 rounded-full text-xs md:text-sm cursor-pointer"
                onClick={() => setIsModalOpen(false)}
                >
                 <X />
              </spa>
                </div>
            </div>
          )}
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
