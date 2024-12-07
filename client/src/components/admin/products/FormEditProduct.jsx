import React, { useEffect, useRef, useState } from "react";
import {
  createProduct,
  listProduct,
  readProduct,
  updateProduct,
} from "../../../api/product";
import { toast } from "react-toastify";
import UploadFile from "./UploadFile";
import { useParams, useNavigate } from "react-router-dom";
import useEcomStore from "../../../store/ecom-store";

const initialState = {
    title: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: '',
    images: [],
};
const FormEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false); // state สำหรับควบคุมการแก้ไขใน mobile

  useEffect(() => {
    getCategory();
    fetchProduct(token, id,form);
  }, []);

  const fetchProduct = async (token, id, form) => {
    try {
      const res = await readProduct(token, id, form);
      // console.log("res form backend", res);
      setForm(res.data);
      setIsEditing(true)
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnChange = (e) => {
    // console.log(e.target.name, e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProduct(token, id, form);
      toast.success(`Edit Product ${res.data.title} success`);
      // ล้างรูปภาพที่อัปโหลด
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // ล้างค่า input file
      }
      navigate('/admin/product');
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      // toast.error(error)
    }
  };

  const handleCancelEdit = () => {
    navigate('/admin/product');
    setIsEditing(false); // ยกเลิกการแก้ไข
  };
  

  return (
    <div className="container mx-auto p-5 bg-white shadow-lg">
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Edit Product</h1>
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
              <option key={index} value={item.id}>
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
        <UploadFile form={form} setForm={setForm} fileInputRef={fileInputRef}/>
      </div>
      <div className="flex justify-end gap-4">
        <button
        onClick={handleCancelEdit}
          className="px-3 md:px-6 py-2 text-sm md:text-base bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg  focus:outline-none focus:ring focus:ring-blue-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 md:px-6 py-2 text-sm md:text-base bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Update Product
        </button>
      </div>
    </form>
  </div>
  );
};

export default FormEditProduct;
