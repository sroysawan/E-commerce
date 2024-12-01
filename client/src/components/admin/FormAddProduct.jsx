import React, { useRef, useState } from "react";
import { createProduct } from "../../api/product";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import UploadFile from "./uploadFile";

const initialState = {
    title: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    images: [],
  };

const FormAddProduct = () => {
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [allImagesUploaded, setAllImagesUploaded] = useState(true); // ใช้ตรวจสอบว่ารูปทั้งหมดถูกอัปโหลดครบหรือยัง
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    images: [],
  });

  const handleOnChange = (e) => {
    // console.log(e.target.name, e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProduct(token, form);
       // ล้างข้อมูลในฟอร์ม
       setForm(initialState);
       setAllImagesUploaded(true); // ตั้งค่าใหม่หลังรีเซ็ต
      toast.success(`Add Product ${res.data.title} success`);
    //   getProductPagination(token, page, limit);
      // ล้างรูปภาพที่อัปโหลด
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // ล้างค่า input file
      }
    } catch (error) {
      console.log(error);
      // toast.error(error)
    }
  };
  return (
    <div className="container mx-auto p-6 bg-white shadow-lg">
      <form onSubmit={handelSubmit} className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-700">Add Product</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={handleOnChange}
              name="title"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter product title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Price
            </label>
            <input
              type="number"
              value={form.price}
              onChange={handleOnChange}
              name="price"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter product price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Quantity
            </label>
            <input
              type="number"
              value={form.quantity}
              onChange={handleOnChange}
              name="quantity"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter product quantity"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Category
            </label>
            <select
              name="categoryId"
              onChange={handleOnChange}
              value={form.categoryId}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((item, index) => (
              <option key={index} value={item.id} className="uppercase">
                {item.name}
              </option>
            ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Description
          </label>
          <textarea
            name="description"
              value={form.description}
              onChange={handleOnChange}
            maxLength="700"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            rows="4"
            placeholder="Enter product description (max 700 characters)"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Images
          </label>
          <UploadFile
            form={form}
            setForm={setForm}
            fileInputRef={fileInputRef}
            setIsUploading={setIsUploading} // ส่ง setIsUploading ไปยัง UploadFile
            setAllImagesUploaded={setAllImagesUploaded} // ส่ง state ใหม
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            onClick={() => setForm(initialState)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-transform transform hover:scale-105"
          >
            Reset
          </button>
          <button
            type="submit"
            className={`px-6 py-2 font-semibold rounded-lg focus:outline-none focus:ring ${
              isUploading || !allImagesUploaded
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={isUploading || !allImagesUploaded} // ปิดปุ่มถ้ารูปยังอัปโหลดไม่ครบ
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormAddProduct;
